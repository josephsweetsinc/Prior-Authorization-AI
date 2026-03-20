import { format } from 'date-fns';

import { type IGetUserParams } from '@/services/user-management';
import { clearParams } from '@/shared/lib/utils';

import { type RoleOptions } from '../types';

export const formatLastLogin = (value: string) => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return '—';
  }
  return format(date, 'MM/dd/yyyy hh:mm a');
};

export const splitFullName = (fullName?: string) => {
  if (!fullName) {
    return [];
  }
  return fullName.split(' ');
};

export const buildGetUsersParams = (
  pageIndex: number,
  role: RoleOptions,
  search: string,
): Partial<IGetUserParams> => {
  const transformedSearchQuery = search.trim();
  const transformedRole = role === 'all' ? undefined : role;
  const page = pageIndex + 1;

  const preparedParams = clearParams({
    page: page,
    role: transformedRole,
    search: transformedSearchQuery.length > 0 ? search : undefined,
  });

  return preparedParams;
};
