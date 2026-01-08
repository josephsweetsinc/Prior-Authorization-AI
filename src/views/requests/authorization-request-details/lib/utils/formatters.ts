import { format, parse } from 'date-fns';

export const displayValue = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  return String(value);
};

export const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not provided';
  }

  return format(new Date(value), 'MM/dd/yyyy');
};

export const formatTime = (value?: string | null) => {
  if (!value) {
    return 'Not provided';
  }

  const parsed = parse(value, 'HH:mm:ss', new Date());
  return format(parsed, 'hh:mm a');
};
