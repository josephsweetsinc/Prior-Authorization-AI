import { type INewRequestState, type FormState } from '@/features/new-request';
import {
  type IRequestData,
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
  extracted?: IExtractedData['extracted_data'] | null,
): FormState | null => {
  if (!extracted) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(FIELD_MAP).map(([formKey, extractedKey]) => [
      formKey,
      String(extracted[extractedKey as keyof IRequestData] ?? ''),
    ]),
  ) as FormState;
};

export const formToExtracted = (form: FormState): IRequestData => {
  const extracted = Object.entries(FIELD_MAP).reduce<Partial<IRequestData>>(
    (acc, [formKey, extractedKey]) => {
      const value = form[formKey as keyof FormState];

      if (value !== undefined && value !== null) {
        acc[extractedKey as keyof IExtractedData['extracted_data']] =
          value as never;
      }

      return acc;
    },
    {},
  );

  return extracted as IRequestData;
};

export const normalizeExtraction = (
  extraction?: IExtractedData | null,
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
