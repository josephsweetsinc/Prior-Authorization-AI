'use client';

import { type PaginationState } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, type HTMLProps } from 'react';

import { useGetRequestsHistoryQuery } from '@/services/requests';
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
  const searchParams = useSearchParams();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const params = filtersToParams({
    pageIndex: pagination.pageIndex,
    ...filters,
  });

  const { data, isFetching } = useGetRequestsHistoryQuery(params);
  const initialRequestId = useMemo(() => {
    const parsedRequestId = Number(searchParams.get('requestId'));
    return Number.isFinite(parsedRequestId) ? parsedRequestId : undefined;
  }, [searchParams]);

  const updateFilters = <Key extends keyof IFilters>(
    key: Key,
    value: IFilters[Key],
  ) => {
    handleFiltersChange(key, value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  return (
    <section className={cn('space-y-5', className)} {...props}>
      <RequestsHeader filters={filters} onFiltersChange={updateFilters} />
      <RequestsTable
        key={`requests-table-${initialRequestId ?? 'none'}`}
        data={data}
        isLoading={isFetching}
        pagination={pagination}
        onPaginationChange={setPagination}
        initialRequestId={initialRequestId}
      />
    </section>
  );
};
