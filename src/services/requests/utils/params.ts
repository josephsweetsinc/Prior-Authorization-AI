import { type RequestStatus } from '@/services/dashboard';
import { clearParams } from '@/shared/lib/utils';

import { DATE_VALUE_MAP } from '../constants';
import { type AuthorizationRequestsDateFilter } from '../types';

type RequestFilters = {
  searchQuery: string;
  status: RequestStatus | 'all';
  date: AuthorizationRequestsDateFilter | string;
};

type BuildRequestsParamsArgs = {
  page: number;
  filters?: RequestFilters;
};

export const buildRequestsParams = ({
  page,
  filters,
}: BuildRequestsParamsArgs): {
  page: number;
  search?: string;
  status?: RequestStatus;
  days?: number;
} => {
  if (!filters) {
    return { page };
  }

  const search = filters.searchQuery.trim();
  const status = filters.status === 'all' ? undefined : filters.status;
  const days = DATE_VALUE_MAP[filters.date as AuthorizationRequestsDateFilter];

  const params = clearParams({
    search: search.length > 0 ? search : undefined,
    status,
    days,
  });

  return { page, ...params };
};
