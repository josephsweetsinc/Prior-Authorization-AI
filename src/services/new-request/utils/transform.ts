import { type NewRequestState, type FormState } from '@/features/new-request';
import { type IExtractedData } from '@/services/media';
import { type MediaItem } from '@/shared/components';

import { FIELD_MAP } from '../constants';

const toNumber = (value: unknown): number | null => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const extractedToForm = (
  extracted?: Record<string, unknown> | null,
): FormState | null => {
  if (!extracted) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(FIELD_MAP).map(([formKey, extractedKey]) => [
      formKey,
      String(extracted[extractedKey] ?? ''),
    ]),
  ) as FormState;
};

export const formToExtracted = (
  form?: FormState | null,
): Record<string, unknown> | null => {
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
  extraction?: Record<string, unknown> | null,
  uploadedFiles?: MediaItem[] | null,
) => {
  if (!extraction) {
    return null;
  }

  const extracted = (extraction as IExtractedData)?.extracted_data ?? null;

  const enriched: Record<string, unknown> = { ...extraction };

  if (uploadedFiles?.length) {
    enriched.files = uploadedFiles.map((f) => ({
      id: f.id,
      filename: f.filename ?? f.name,
      file_size: f.file_size ?? f.size,
    }));
  }

  return { extracted, enriched };
};

export const extractFileIdsFromStored = (
  stored?: NewRequestState,
): number[] => {
  if (!stored) {
    return [];
  }

  const files =
    stored.extractionResult?.files ??
    stored.extractionResult?.files_uploaded ??
    stored.extractedData?.files ??
    [];

  if (!Array.isArray(files)) {
    return [];
  }

  return files
    .map((file) => toNumber(file?.id ?? file?.file_id ?? file?.fileId))
    .filter((id): id is number => id !== null);
};
