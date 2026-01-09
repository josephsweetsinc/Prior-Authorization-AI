import { format } from 'date-fns';

export const formatLastLogin = (value: string) => {
  return format(new Date(value), 'MM/dd/yyyy hh:mm a');
};

export const splitFullName = (fullName?: string) => {
  if (!fullName) {
    return [];
  }
  return fullName.split(' ');
};
