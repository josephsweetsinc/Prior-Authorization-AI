import { format } from 'date-fns';

export const formatLastLogin = (value: string) => {
  return format(new Date(value), 'MM/dd/yyyy hh:mm a');
};
