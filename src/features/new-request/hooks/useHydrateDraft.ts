import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { extractedToForm, type IUploadAndExtractionResult } from '@/services';

import { clear, setExtractionResult, setForm } from '../store/slice';

interface Params {
  draft?: IUploadAndExtractionResult | null;
  isSuccess?: boolean;
}

export const useHydrateDraft = ({ draft, isSuccess }: Params) => {
  const hasHydratedDraft = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!draft || !isSuccess || hasHydratedDraft.current) {
      return;
    }

    dispatch(clear());

    dispatch(setExtractionResult(draft));

    const form = extractedToForm(draft.extracted_data);

    if (form) {
      dispatch(setForm(form));
    }

    hasHydratedDraft.current = true;
  }, [draft, isSuccess, dispatch]);
};
