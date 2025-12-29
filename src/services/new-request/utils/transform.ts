import { type INewRequestState, type FormState } from '@/features/new-request';
import {
  type IExtractedData,
  type IUploadAndExtractionResult,
} from '@/services/media';
import { type MediaItem } from '@/shared/components';

import { FIELD_MAP } from '../constants';

const toNumber = (value: unknown): number | null => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const extractedToForm = (
  extracted?: IExtractedData | null,
): FormState | null => {
  if (!extracted) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(FIELD_MAP).map(([formKey, extractedKey]) => [
      formKey,
      String(extracted[extractedKey as keyof IExtractedData] ?? ''),
    ]),
  ) as FormState;
};

export const formToExtracted = (
  form?: FormState | null,
): IExtractedData | null => {
  if (!form) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(FIELD_MAP).map(([formKey, extractedKey]) => [
      extractedKey,
      form[formKey as keyof FormState],
    ]),
  );
};

export const normalizeExtraction = (
  extraction?: IExtractedData | null,
  uploadedFiles?: MediaItem[] | null,
) => {
  if (!extraction || !extraction.extracted_data) {
    return null;
  }

  const extracted = extraction.extracted_data;
  const enriched: IUploadAndExtractionResult = {
    ...extracted,
    files: uploadedFiles ?? [],
  };

  return { extracted, enriched };
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
