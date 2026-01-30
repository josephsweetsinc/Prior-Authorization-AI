export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) {
    return '';
  }

  const country = digits.slice(0, 1);
  const area = digits.slice(1, 4);
  const prefix = digits.slice(4, 7);
  const line = digits.slice(7, 11);

  let formatted = country;
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
