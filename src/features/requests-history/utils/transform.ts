import { type IFilters } from '../types';

export const filtersToParams = ({
  pageIndex,
  date,
  searchQuery,
  status,
}: { pageIndex: number } & IFilters) => {
  const params = {
    page: pageIndex + 1,
    search: searchQuery.trim(),
    days: date === 'all' ? undefined : parseInt(date),
    status: status === 'all' ? undefined : status,
  };

  return params;
};
