import type { ChangeEvent } from 'react';

export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) {
    return '';
  }

  const country = digits.slice(0, 1);
  const area = digits.slice(1, 4);
  const prefix = digits.slice(4, 7);
  const line = digits.slice(7, 11);

  let formatted = `+${country}`;
  if (digits.length > 1) {
    formatted += ` (${area}`;
  }
  if (digits.length >= 4) {
    formatted += ')';
  }
  if (digits.length >= 4 && prefix) {
    formatted += ` ${prefix}`;
  }
  if (digits.length >= 7 && line) {
    formatted += `-${line}`;
  }

  return formatted;
}

type PhoneChangeHandlerOptions = {
  maxDigits?: number;
  setValue: (
    ..._args: ['phone', string, { shouldValidate?: boolean }?]
  ) => void;
  lastDigitsRef: { current: string };
  shouldValidate?: boolean;
};

export function createPhoneInputChangeHandler({
  maxDigits = 11,
  setValue,
  lastDigitsRef,
  shouldValidate = true,
}: PhoneChangeHandlerOptions) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    let digits = rawValue.replace(/\D/g, '');
    const endedWithNonDigit = /\D$/.test(rawValue);
    const inputType = (event.nativeEvent as InputEvent | undefined)?.inputType;

    if (
      (endedWithNonDigit || inputType === 'deleteContentBackward') &&
      digits.length === lastDigitsRef.current.length
    ) {
      digits = digits.slice(0, -1);
    }

    digits = digits.slice(0, maxDigits);
    lastDigitsRef.current = digits;

    const formatted = formatPhoneNumber(digits);
    setValue('phone', formatted, { shouldValidate });
  };
}
