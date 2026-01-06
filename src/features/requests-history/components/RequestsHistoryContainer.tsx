'use client';

import { type PaginationState } from '@tanstack/react-table';
import { useState, type HTMLProps } from 'react';

import { useGetRequestsHistoryQuery } from '@/services/requests-history';
import { useFilters } from '@/shared/hooks/useFilters';
import { cn } from '@/shared/lib/utils';

import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '../constants';
import { type IFilters } from '../types';
import { filtersToParams } from '../utils';

import { RequestsHeader } from './RequestsHeader';
import { RequestsTable } from './RequestsTable';

export const RequestsHistoryContainer = ({
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  const { filters, handleFiltersChange } =
    useFilters<IFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const params = filtersToParams({
    pageIndex: pagination.pageIndex,
    ...filters,
  });

  const { data, isLoading } = useGetRequestsHistoryQuery(params);

  return (
    <section className={cn('space-y-5', className)} {...props}>
      <RequestsHeader filters={filters} onFiltersChange={handleFiltersChange} />
      <RequestsTable
        data={data}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </section>
  );
};
