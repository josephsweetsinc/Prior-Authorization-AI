import { type HTMLProps } from 'react';

import { type RequestStatus } from '@/services/dashboard';
import { SearchFilter, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { DATE_OPTIONS, STATUS_OPTIONS } from '../constants';
import { type IFilters } from '../types';

type Props = {
  filters: IFilters;

  onFiltersChange: <Key extends keyof IFilters>(
    _key: Key,
    _value: IFilters[Key],
  ) => void;
} & HTMLProps<HTMLDivElement>;

export const RequestsHeader = ({
  filters,
  onFiltersChange,
  className,
  ...props
}: Props) => {
  const handleSearchQueryChange = (value: string) => {
    onFiltersChange('searchQuery', value);
  };

  const handleDateFilterChange = (value: string) => {
    onFiltersChange('date', value);
  };

  const handleStatusFilterChange = (value: string) => {
    onFiltersChange('status', value as RequestStatus | 'all');
  };

  return (
    <div className={cn('flex items-center gap-2.5', className)} {...props}>
      <SearchFilter
        value={filters.searchQuery}
        onChange={handleSearchQueryChange}
      />
      <Select
        options={DATE_OPTIONS}
        value={filters.date}
        onChange={handleDateFilterChange}
        className='shrink grow basis-1/4'
      />
      <Select
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={handleStatusFilterChange}
        className='shrink grow basis-1/4'
      />
    </div>
  );
};
