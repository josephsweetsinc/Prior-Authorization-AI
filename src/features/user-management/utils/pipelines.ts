import { type IUserEntry } from '@/services/user-management';

import { type IFilters } from '../types';

import { filterByQuery, filterByRole } from './filters';

export const filterPipeline = (
  data: IUserEntry[],
  filters: IFilters,
): IUserEntry[] => {
  return [filterByRole, filterByQuery].reduce(
    (acc, filter) =>
      filter === filterByQuery
        ? filter(acc, filters.searchQuery)
        : filter(acc, filters.role),
    data,
  );
};
