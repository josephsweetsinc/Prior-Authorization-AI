'use client';

import { useState, type HTMLProps } from 'react';

import { useGetRequestsHistoryQuery } from '@/services/requests-history';
import { cn } from '@/shared/lib/utils';

import { type IFilters } from '../types';
import { filterPipeline } from '../utils';

import { RequestsHeader } from './RequestsHeader';
import { RequestsTable } from './RequestsTable';

export const RequestsHistoryContainer = ({
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  const [filters, setFilters] = useState<IFilters>({
    searchQuery: '',
    status: 'all',
    date: 'all',
  });
  const { data, isLoading } = useGetRequestsHistoryQuery();

  const filteredData = filterPipeline(data?.items ?? [], filters);

  const handleFiltersChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className={cn('space-y-5', className)} {...props}>
      <RequestsHeader filters={filters} onFiltersChange={handleFiltersChange} />
      <RequestsTable data={filteredData} isLoading={isLoading} />
    </section>
  );
};
