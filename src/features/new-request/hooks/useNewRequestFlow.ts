import { useState, useCallback } from 'react';

import {
  type IUploadAndExtractionResult,
  type IExtractedData,
  type IExtractionResponse,
} from '@/services';
import { normalizeExtraction } from '@/services/new-request/utils';
import type { MediaItem } from '@/shared/components/upload/Uploader';

interface Params {
  totalSteps: number;
  initialStep?: number;
  initialExtractedData?: Partial<IExtractedData> | null;
  initialExtractionResult?: IUploadAndExtractionResult | null;
  onExtractionReady?: (_data: IUploadAndExtractionResult) => void;
}

export const useNewRequestFlow = ({
  initialStep = 1,
  totalSteps,
  initialExtractedData = null,
  initialExtractionResult = null,
  onExtractionReady,
}: Params) => {
  const [step, setStep] = useState(initialStep);
  const [isReviewEditing, setIsReviewEditing] = useState(false);
  const [extractedData, setExtractedData] = useState(initialExtractedData);

  const [extractionResult, setExtractionResult] = useState(
    initialExtractionResult,
  );

  const next = useCallback(
    (
      uploadedFiles?: MediaItem[] | null,
      extraction?: IExtractionResponse | null,
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
