import { type IFilters } from '@/features/requests-history';
import { type IRequest } from '@/services/requests-history';

import { filterByDate, filterByQuery, filterByStatus } from './filters';

export const filterPipeline = (
  data: IRequest[],
  filters: IFilters,
): IRequest[] => {
  return [filterByStatus, filterByDate, filterByQuery].reduce(
    (acc, filter) =>
      filter === filterByQuery
        ? filter(acc, filters.searchQuery)
        : filter === filterByStatus
          ? filter(acc, filters.status)
          : filter(acc, filters.date),
    data,
  );
};
