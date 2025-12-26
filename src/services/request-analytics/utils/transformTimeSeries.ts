type DateFields = {
  day: boolean;
  month: boolean;
  year: boolean;
};

export function transformTimeSeries<T extends { date: string }>(
  data: T[],
  fields: DateFields,
): Record<string, string | number>[] {
  const formatter = new Intl.DateTimeFormat('en-US', {
    ...(fields.day && { day: '2-digit' }),
    ...(fields.month && { month: '2-digit' }),
    ...(fields.year && { year: 'numeric' }),
  });

  return data.map(({ date, ...rest }) => ({
    date: formatter.format(new Date(date)),
    ...rest,
  }));
}
