'use client';

import { type PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { useGetAuthorizationRequestsQuery } from '@/services/requests';

import { useAuthorizationRequestsFilters } from '../hooks';
import { type AuthorizationRequestsFilters } from '../types';
import { buildAuthorizationRequestsParams } from '../utils';

import { AuthorizationRequestsFilters as Filters } from './AuthorizationRequestsFilters';
import { AuthorizationRequestsTable } from './AuthorizationRequestsTable';

const DEFAULT_PAGE_SIZE = 8;

export const AuthorizationRequestsContainer = () => {
  const { filters, handleFiltersChange } = useAuthorizationRequestsFilters();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const queryParams = useMemo(
    () =>
      buildAuthorizationRequestsParams({
        page: pagination.pageIndex + 1,
        filters,
      }),
    [filters, pagination.pageIndex],
  );

  const { data, isFetching } = useGetAuthorizationRequestsQuery(queryParams);

  const handleFiltersUpdate = <Key extends keyof AuthorizationRequestsFilters>(
    key: Key,
    value: AuthorizationRequestsFilters[Key],
  ) => {
    handleFiltersChange(key, value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  return (
    <section className='space-y-5'>
      <Filters filters={filters} onFiltersChange={handleFiltersUpdate} />
      <AuthorizationRequestsTable
        isLoading={isFetching}
        data={data}
        paginationState={pagination}
        onPaginationChange={setPagination}
      />
    </section>
  );
};
