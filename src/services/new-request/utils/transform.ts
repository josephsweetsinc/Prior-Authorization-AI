import { type INewRequestState, type FormState } from '@/features/new-request';
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

export const extractedToForm = (
  extracted?: Partial<IExtractedData>,
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
