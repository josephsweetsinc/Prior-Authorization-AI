import { type DateCount } from '@/services/dashboard';

export function transformDateCount(
  data: DateCount[],
): Record<string, string | number>[] {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
  });

  const transformedData = data.map(({ date, count }) => {
    const day = new Date(date);

    return {
      date: formatter.format(day),
      count,
    };
  });

  return transformedData;
}
