import {
  DATE_VALUE_MAP,
  type AuthorizationRequestsDateFilter,
  type AuthorizationRequestsFilters,
  type AuthorizationRequestsParams,
} from '@/services';
import { clearParams } from '@/shared/lib/utils';

export const mapDateFilterToDays = (
  value: AuthorizationRequestsDateFilter,
): number | undefined => {
  return DATE_VALUE_MAP[value];
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

  return clearParams({
    page,
    search: search.length > 0 ? search : undefined,
    status,
    days,
  });
};
