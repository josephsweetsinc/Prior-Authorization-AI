import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { extractedToForm, type IRequestDetails } from '@/services';

import { setExtractionResult, setForm } from '../store/slice';
import {
  transformDocumentsToMediaItems,
  transformRequestToExtraction,
} from '../utils/transform';

interface Params {
  draftId?: number;
  draft?: IRequestDetails | null;
  isSuccess?: boolean;
}

export const useHydrateDraft = ({ draftId, draft, isSuccess }: Params) => {
  const hasHydratedDraft = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!draftId || !draft || !isSuccess || hasHydratedDraft.current) {
      return;
    }

    const extraction = transformRequestToExtraction(draft);
    const files = transformDocumentsToMediaItems(draft.documents);

    if (!extraction || !files) {
      return;
    }

    dispatch(setExtractionResult({ ...extraction, files }));

    const form = extractedToForm(extraction.extracted_data);
    if (form) {
      dispatch(setForm(form));
    }

    hasHydratedDraft.current = true;
  }, [draftId, draft, isSuccess, dispatch]);
};
