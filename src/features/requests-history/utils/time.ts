export const formatDateTime = (
  date: string | number | Date,
  locale: string = 'en-US',
) => {
  const d = new Date(date);

  const datePart = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);

  const timePart = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  return `${datePart} at ${timePart}`;
};
