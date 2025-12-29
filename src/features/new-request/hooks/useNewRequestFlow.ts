import { useState, useCallback } from 'react';

import { normalizeExtraction } from '@/services/new-request/utils';
import type { MediaItem } from '@/shared/components/upload/Uploader';

interface Params {
  totalSteps: number;
  initialExtractedData?: Record<string, unknown> | null;
  initialExtractionResult?: Record<string, unknown> | null;
  // eslint-disable-next-line no-unused-vars
  onExtractionReady?: (data: Record<string, unknown>) => void;
}

export const useNewRequestFlow = ({
  totalSteps,
  initialExtractedData = null,
  initialExtractionResult = null,
  onExtractionReady,
}: Params) => {
  const [step, setStep] = useState(1);
  const [isReviewEditing, setIsReviewEditing] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<
    string,
    unknown
  > | null>(initialExtractedData);

  const [extractionResult, setExtractionResult] = useState<Record<
    string,
    unknown
  > | null>(initialExtractionResult);

  const next = useCallback(
    (
      uploadedFiles?: MediaItem[] | null,
      extraction?: Record<string, unknown> | null,
    ) => {
      const normalized = normalizeExtraction(extraction, uploadedFiles);

      if (normalized) {
        setExtractedData(normalized.extracted);
        setExtractionResult(normalized.enriched);

        if (onExtractionReady) {
          try {
            onExtractionReady(JSON.parse(JSON.stringify(normalized.enriched)));
          } catch {
            onExtractionReady(normalized.enriched);
          }
        }
      }

      setStep((s) => Math.min(s + 1, totalSteps));
    },
    [onExtractionReady, totalSteps],
  );

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  return {
    step,
    next,
    prev,
    isReviewEditing,
    startReviewEdit: () => setIsReviewEditing(true),
    finishReviewEdit: () => setIsReviewEditing(false),
    extractedData,
    extractionResult,
    isExtractionComplete: Boolean(extractionResult?.is_complete),
  };
};
