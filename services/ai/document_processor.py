"""Document processor for converting various file formats to images.

This module provides functionality to convert PDF documents and images
to a format suitable for AI vision model processing.

"""

import asyncio
import base64
import io
import logging
from enum import StrEnum

import fitz  # PyMuPDF
from PIL import Image

from config.settings import Settings

logger = logging.getLogger(__name__)
settings = Settings.load()


class SupportedContentType(StrEnum):
    """Supported content types for document processing."""

    PDF = 'application/pdf'
    PNG = 'image/png'
    JPEG = 'image/jpeg'
    JPG = 'image/jpg'
    GIF = 'image/gif'
    WEBP = 'image/webp'
    TIFF = 'image/tiff'


# Content types that are images and don't need conversion
IMAGE_CONTENT_TYPES = {
    SupportedContentType.PNG,
    SupportedContentType.JPEG,
    SupportedContentType.JPG,
    SupportedContentType.GIF,
    SupportedContentType.WEBP,
}


class DocumentProcessor:
    """Processor for converting documents to images for AI analysis.

    This class handles:
    - PDF to image conversion (using PyMuPDF)
    - Image format normalization
    - Base64 encoding for API transmission

    """

    def __init__(
        self, dpi: int | None = None, max_pages: int | None = None
    ) -> None:
        """Initialize document processor.

        Args:
            dpi: DPI for rendering PDF pages. Defaults to settings value.
            max_pages: Maximum pages to process. Defaults to settings value.

        """
        self._dpi = dpi or settings.llm_settings.PDF_RENDER_DPI
        self._max_pages = max_pages or settings.llm_settings.PDF_MAX_PAGES

    def _render_pdf_pages_sync(
        self,
        pdf_bytes: bytes,
    ) -> list[Image.Image]:
        """Render PDF pages to PIL Images synchronously.

        Args:
            pdf_bytes: Raw PDF file bytes.

        Returns:
            List of PIL Image objects, one per page.

        """
        pdf = fitz.open(stream=pdf_bytes, filetype='pdf')
        pages: list[Image.Image] = []

        # Calculate a zoom factor (PDF base DPI is 72)
        zoom = self._dpi / 72
        matrix = fitz.Matrix(zoom, zoom)

        try:
            total_pages = len(pdf)
            pages_to_process = min(total_pages, self._max_pages)

            if total_pages > self._max_pages:
                logger.warning(
                    'PDF has %d pages, processing only first %d pages',
                    total_pages,
                    self._max_pages,
                )

            for page_index in range(pages_to_process):
                page = pdf[page_index]
                pixmap = page.get_pixmap(matrix=matrix)
                img_bytes = pixmap.tobytes('png')
                pil_img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
                pages.append(pil_img)
                logger.debug(
                    'Rendered PDF page %d/%d: %dx%d',
                    page_index + 1,
                    pages_to_process,
                    pil_img.width,
                    pil_img.height,
                )
        finally:
            pdf.close()

        logger.info(
            'Rendered %d pages from PDF (total: %d)', len(pages), total_pages
        )
        return pages

    async def render_pdf_pages(
        self,
        pdf_bytes: bytes,
    ) -> list[Image.Image]:
        """Render PDF pages to PIL Images asynchronously.

        Args:
            pdf_bytes: Raw PDF file bytes.

        Returns:
            List of PIL Image objects, one per page.

        """
        return await asyncio.to_thread(
            self._render_pdf_pages_sync,
            pdf_bytes,
        )

    def _process_image_sync(self, image_bytes: bytes) -> Image.Image:
        """Process image bytes to PIL Image synchronously.

        Args:
            image_bytes: Raw image file bytes.

        Returns:
            PIL Image object.

        """
        img = Image.open(io.BytesIO(image_bytes))
        # Convert to RGB if necessary (handles RGBA, palette, etc.)
        if img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')  # type: ignore
        return img

    async def process_image(self, image_bytes: bytes) -> Image.Image:
        """Process image bytes to PIL Image asynchronously.

        Args:
            image_bytes: Raw image file bytes.

        Returns:
            PIL Image object.

        """
        return await asyncio.to_thread(
            self._process_image_sync,
            image_bytes,
        )

    def image_to_base64(
        self,
        image: Image.Image,
        *,
        image_format: str = 'JPEG',
        quality: int = 75,
    ) -> str:
        """Convert PIL Image to base64 string.

        Uses JPEG format with optimized quality for faster processing
        and smaller payload size while maintaining readability for AI.

        Args:
            image: PIL Image object.
            image_format: Output format (PNG, JPEG, etc.). Defaults to JPEG.
            quality: JPEG quality (1-100). Defaults to 75 for balance.

        Returns:
            Base64 encoded string of the image.

        """
        buffer = io.BytesIO()
        save_kwargs: dict[str, int | str] = {'format': image_format}
        if image_format.upper() == 'JPEG':
            save_kwargs['quality'] = quality
            save_kwargs['optimize'] = True

        image.save(buffer, **save_kwargs)  # type: ignore
        buffer.seek(0)
        return base64.standard_b64encode(buffer.read()).decode('utf-8')

    async def process_document(
        self,
        file_bytes: bytes,
        content_type: str,
    ) -> list[tuple[str, str]]:
        """Process a document and return base64-encoded images.

        Args:
            file_bytes: Raw file bytes.
            content_type: MIME type of the file.

        Returns:
            List of tuples (base64_data, media_type) for each page/image.

        Raises:
            ValueError: If content type is not supported.

        """
        result: list[tuple[str, str]] = []

        if content_type == SupportedContentType.PDF:
            # PDF: render pages to images (limited to max_pages)
            pages = await self.render_pdf_pages(file_bytes)
            for page in pages:
                # Use JPEG for smaller size and faster processing
                b64_data = self.image_to_base64(
                    page, image_format='JPEG', quality=75
                )
                result.append((b64_data, 'image/jpeg'))
        elif content_type in IMAGE_CONTENT_TYPES:
            # Image: process and normalize
            image = await self.process_image(file_bytes)
            # Use JPEG for smaller size and faster processing
            b64_data = self.image_to_base64(
                image, image_format='JPEG', quality=75
            )
            result.append((b64_data, 'image/jpeg'))
        else:
            error_msg = f'Unsupported content type: {content_type}'
            raise ValueError(error_msg)

        logger.info(
            'Processed document (type=%s): %d images',
            content_type,
            len(result),
        )
        return result

    @staticmethod
    def is_supported_content_type(content_type: str) -> bool:
        """Check if content type is supported for processing.

        Args:
            content_type: MIME type to check.

        Returns:
            True if supported, False otherwise.

        """
        try:
            SupportedContentType(content_type)
        except ValueError:
            return False
        else:
            return True
