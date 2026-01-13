import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { toast } from 'react-toastify';

import type { ParsedApiError } from './types';

export function handleParsedApiError<
  TFieldValues extends FieldValues = FieldValues,
>(parsed: ParsedApiError, setError: UseFormSetError<TFieldValues>): boolean {
  if (parsed.validation && Array.isArray(parsed.validation.detail)) {
    for (const d of parsed.validation.detail) {
      const loc = d.loc;
      if (
        Array.isArray(loc) &&
        loc.length > 0 &&
        typeof loc[loc.length - 1] === 'string'
      ) {
        const field = loc[loc.length - 1] as unknown as FieldPath<TFieldValues>;
        setError(field, { type: 'server', message: d.msg });
      }
      toast.error(d.msg);
    }
    return true;
  }

  if (parsed.message) {
    toast.error(parsed.message);
    return true;
  }

  return false;
}
