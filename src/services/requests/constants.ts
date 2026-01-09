import {
  type AuthorizationRequestsFilters,
  type AuthorizationRequestsParams,
  type AuthorizationRequestsDateFilter,
} from './types';

const dateFilterToDaysMap: Record<
  AuthorizationRequestsDateFilter,
  number | undefined
> = {
  all: undefined,
  today: 0,
  '7-days': 7,
  '30-days': 30,
  '90-days': 90,
  year: 365,
};

export const mapDateFilterToDays = (
  value: AuthorizationRequestsDateFilter,
): number | undefined => {
  return dateFilterToDaysMap[value];
};

export const buildAuthorizationRequestsParams = ({
  page = 1,
  filters,
}: {
  page?: number;
  filters?: AuthorizationRequestsFilters;
}): AuthorizationRequestsParams => {
  if (!filters) {
    return { page };
  }

  const search = filters.searchQuery.trim();
  const status = filters.status === 'all' ? undefined : filters.status;
  const days = mapDateFilterToDays(filters.date);

  return {
    page,
    search: search.length > 0 ? search : undefined,
    status,
    days,
  };
};
