import { formatRelative } from 'date-fns';

export const formatDate = (value: string) => {
  return formatRelative(new Date(value), new Date());
};
