import { type INewRequestState, type FormState } from '@/features/new-request';
import { type CompletionStatus } from '@/services/requests';
import { type MediaItem } from '@/shared/components';

import { FIELD_MAP } from '../constants';
import {
  type IExtractionResponse,
  type IUploadAndExtractionResult,
  type IExtractedData,
} from '../types';

const toNumber = (value: unknown): number | null => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const isExtractionComplete = (extracted: Partial<IExtractedData>): boolean => {
  return (Object.keys(extracted) as (keyof IExtractedData)[]).every((key) => {
    const value = extracted[key];

    if (typeof value === 'boolean') {
      return true;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    return Boolean(value);
  });
};

const getCompletionFlags = (
  extracted: Partial<IExtractedData>,
  files?: MediaItem[] | null,
): { hasFiles: boolean; isComplete: boolean } => {
  return {
    hasFiles: Boolean(files?.length),
    isComplete: isExtractionComplete(extracted),
  };
};

const buildCompletionStatus = (
  extracted: Partial<IExtractedData>,
  files?: MediaItem[] | null,
): CompletionStatus => {
  const { hasFiles, isComplete } = getCompletionFlags(extracted, files);

  return {
    overall_status: hasFiles
      ? isComplete
        ? 'complete'
        : 'incomplete'
      : 'missing',
    missing_fields: [],
    missing_documents: [],
    can_submit: hasFiles && isComplete,
  };
};

export const extractedToForm = (
  extracted: Partial<IExtractedData> | null,
): Partial<FormState> | null => {
  if (!extracted) {
    return null;
  }

  const transformedData = Object.fromEntries(
    Object.entries(FIELD_MAP).map(([formKey, extractedKey]) => [
      formKey,
      String(extracted[extractedKey as keyof IExtractedData] ?? ''),
    ]),
  );

  return transformedData;
};

export const formToExtracted = (
  form: Partial<FormState>,
): Partial<IExtractedData> => {
  const transformedData = Object.fromEntries(
    Object.entries(FIELD_MAP).map(([formKey, extractedKey]) => [
      extractedKey,
      String(form[formKey as keyof FormState] ?? ''),
    ]),
  );

  return transformedData;
};

export const normalizeExtraction = (
  extraction?: IExtractionResponse | null,
  uploadedFiles?: MediaItem[] | null,
) => {
  if (!extraction || !extraction.extracted_data) {
    return null;
  }

  const enriched: IUploadAndExtractionResult = {
    ...extraction,
    files: uploadedFiles ?? [],
    completion_status:
      extraction.completion_status ??
      buildCompletionStatus(extraction.extracted_data, uploadedFiles),
  };

  return { extracted: extraction.extracted_data, enriched };
};

export const extractFileIdsFromStored = (
  stored?: INewRequestState,
): number[] => {
  if (!stored) {
    return [];
  }

  const files = stored.extractionResult?.files;

  if (!Array.isArray(files)) {
    return [];
  }

  return files
    .map((file) => toNumber(file.id))
    .filter((id): id is number => id !== null);
};
