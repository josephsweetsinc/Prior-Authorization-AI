"""AI service for extracting data from medical documents.

This service uses LangChain with OpenAI GPT-4 Vision to extract
structured data from medical documents (PDFs, images).

"""

import asyncio
import logging
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from schemas.ai_extraction import (
    AIExtractionResponse,
    ExtractedTransportationData,
)
from services.ai.document_processor import DocumentProcessor
from services.ai.prompts import EXTRACTION_SYSTEM_PROMPT
from services.aws.actions import S3Actions

logger = logging.getLogger(__name__)


class AIExtractionService:
    """Service for AI-powered data extraction from medical documents.

    This service uses GPT-4 Vision to extract structured data from
    uploaded medical documents including PDFs and images.

    """

    def __init__(
        self,
        s3_actions: S3Actions | None = None,
        document_processor: DocumentProcessor | None = None,
        llm: ChatOpenAI | None = None,
    ) -> None:
        """Initialize AI extraction service.

        Args:
            s3_actions: S3Actions instance for accessing files.
            document_processor: Document processor for converting files.
            llm: ChatOpenAI instance. If None, uses get_llm() dependency.

        """
        self._s3_actions = s3_actions or S3Actions()
        self._document_processor = document_processor or DocumentProcessor()
        if llm is None:
            # Lazy import to avoid circular dependency
            # dependencies.auth imports services, which would create a cycle
            from dependencies.ai import get_llm  # noqa: PLC0415

            self._llm = get_llm()
        else:
            self._llm = llm

    async def _download_file_from_s3(self, s3_key: str) -> tuple[bytes, str]:
        """Download file from S3 and return bytes with content type.

        Args:
            s3_key: S3 key (path) of the file.

        Returns:
            Tuple of (file_bytes, content_type).

        """
        response = self._s3_actions.s3_client.get_object(
            Bucket=self._s3_actions.aws_bucket_name,
            Key=s3_key,
        )
        file_bytes = response['Body'].read()
        content_type = response.get('ContentType', 'application/octet-stream')

        logger.debug(
            'Downloaded file from S3: key=%s, size=%d, type=%s',
            s3_key,
            len(file_bytes),
            content_type,
        )
        return file_bytes, content_type

    async def _prepare_images_from_files(
        self,
        file_s3_keys: list[str],
    ) -> list[tuple[str, str]]:
        """Download files from S3 and convert to base64 images.

        Processes files in parallel for better performance.

        Args:
            file_s3_keys: List of S3 keys for files to process.

        Returns:
            List of tuples (base64_data, media_type) for all images.

        """

        async def process_single_file(s3_key: str) -> list[tuple[str, str]]:
            """Process a single file and return its images."""
            try:
                file_bytes, content_type = await self._download_file_from_s3(
                    s3_key
                )

                if not self._document_processor.is_supported_content_type(
                    content_type
                ):
                    logger.warning(
                        'Unsupported content type %s for file %s, skipping',
                        content_type,
                        s3_key,
                    )
                    return []

                return await self._document_processor.process_document(
                    file_bytes,
                    content_type,
                )
            except Exception:
                logger.exception('Failed to process file %s', s3_key)
                return []

        # Process all files in parallel
        tasks = [process_single_file(s3_key) for s3_key in file_s3_keys]
        results = await asyncio.gather(*tasks)

        # Flatten results
        all_images: list[tuple[str, str]] = []
        for images in results:
            all_images.extend(images)

        logger.info(
            'Prepared %d images from %d files',
            len(all_images),
            len(file_s3_keys),
        )
        return all_images

    @staticmethod
    def _build_message_content(
        images: list[tuple[str, str]],
    ) -> list[str | dict[str, Any]]:
        """Build message content with images for the LLM.

        Args:
            images: List of (base64_data, media_type) tuples.

        Returns:
            List of content blocks for HumanMessage.

        """
        content: list[str | dict[str, Any]] = [
            {
                'type': 'text',
                'text': (
                    'Please analyze the following medical document images '
                    'and extract all relevant transportation request '
                    f'information. There are {len(images)} page(s)/image(s) total.'  # noqa: E501
                ),
            }
        ]

        for idx, (b64_data, media_type) in enumerate(images):
            content.append(
                {
                    'type': 'image_url',
                    'image_url': {
                        'url': f'data:{media_type};base64,{b64_data}',
                        'detail': 'high',
                    },
                }
            )
            logger.debug('Added image %d to message content', idx + 1)
        return content

    async def extract_data_from_files(
        self,
        file_s3_keys: list[str],
        *,
        user_id: int | None = None,
    ) -> AIExtractionResponse:
        """Extract structured data from medical documents.

        This method:
        1. Downloads files from S3
        2. Converts PDFs/images to base64
        3. Sends to GPT-4 Vision for analysis
        4. Returns structured ExtractedTransportationData

        Args:
            file_s3_keys: List of S3 keys (paths) for uploaded documents.
            user_id: Optional user ID for context/logging.

        Returns:
            AIExtractionResponse: Extracted data with metadata.

        """
        logger.info(
            'Starting AI extraction for %d files (user_id=%s)',
            len(file_s3_keys),
            user_id,
        )

        # Handle empty input
        if not file_s3_keys:
            logger.warning('No files provided for extraction')
            return AIExtractionResponse(
                extracted_data=ExtractedTransportationData(),
                extraction_metadata={
                    'status': 'no_files',
                    'files_processed': '0',
                },
            )

        # Prepare images from all files
        images = await self._prepare_images_from_files(file_s3_keys)

        if not images:
            logger.warning('No images could be extracted from files')
            return AIExtractionResponse(
                extracted_data=ExtractedTransportationData(),
                extraction_metadata={
                    'status': 'no_images',
                    'files_processed': str(len(file_s3_keys)),
                    'note': 'Could not extract images from provided files',
                },
            )

        # Build messages for LLM
        message_content = self._build_message_content(images)
        messages = [
            SystemMessage(content=EXTRACTION_SYSTEM_PROMPT),
            HumanMessage(content=message_content),
        ]

        # Call LLM with structured output
        try:
            llm_with_structure = self._llm.with_structured_output(
                ExtractedTransportationData,
                method='json_schema',
                strict=True,
            )
            extracted_data = ExtractedTransportationData.model_validate(
                await llm_with_structure.ainvoke(messages)
            )

            logger.info(
                'Successfully extracted data from %d images',
                len(images),
            )

            return AIExtractionResponse(
                extracted_data=extracted_data,
                extraction_metadata={
                    'status': 'success',
                    'files_processed': str(len(file_s3_keys)),
                    'images_analyzed': str(len(images)),
                    'model': self._llm.model_name,
                },
            )

        except Exception:
            logger.exception('LLM extraction failed')
            return AIExtractionResponse(
                extracted_data=ExtractedTransportationData(),
                extraction_metadata={
                    'status': 'error',
                    'files_processed': str(len(file_s3_keys)),
                    'note': 'AI extraction failed, please try again',
                },
            )

    async def extract_data_from_files_sync(
        self,
        file_s3_keys: list[str],
        *,
        user_id: int | None = None,
    ) -> AIExtractionResponse:
        """Synchronous version of extract_data_from_files.

        For cases where async is not needed or for compatibility.

        Args:
            file_s3_keys: List of S3 keys (paths) for uploaded documents.
            user_id: Optional user ID for context.

        Returns:
            AIExtractionResponse: Extracted data with metadata.

        """
        return await self.extract_data_from_files(
            file_s3_keys=file_s3_keys,
            user_id=user_id,
        )
