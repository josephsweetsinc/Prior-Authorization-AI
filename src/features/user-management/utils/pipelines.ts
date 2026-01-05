import { type IFilters, type IUserEntry } from '../types';

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
