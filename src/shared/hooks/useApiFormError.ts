import { useCallback } from 'react';
import { type FieldValues, type UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';

import { handleParsedApiError } from '@/services/api/errorHandlers';
import { parseApiError } from '@/services/api/types';

export function useApiFormError<TFieldValues extends FieldValues>(
  setError?: UseFormSetError<TFieldValues>,
) {
  const handleError = useCallback(
    (err: unknown) => {
      const parsed = parseApiError(err);

      if (setError) {
        const handledByForm = handleParsedApiError(parsed, setError);

        if (handledByForm) {
          return;
        }
      }

      const message =
        parsed.message || 'Something went wrong. Please try again later.';
      toast.error(message);
    },
    [setError],
  );

  return { handleError };
}
