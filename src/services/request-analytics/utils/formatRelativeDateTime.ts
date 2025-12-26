export function formatRelativeDateTime(
  isoDate: string,
  locale: string = 'en-US',
): string {
  const date = new Date(isoDate);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  let dayLabel: string;

  if (isSameDay(date, now)) {
    dayLabel = 'Today';
  } else if (isSameDay(date, yesterday)) {
    dayLabel = 'Yesterday';
  } else {
    dayLabel = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: '2-digit',
    }).format(date);
  }

  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${dayLabel} ${time}`;
}
