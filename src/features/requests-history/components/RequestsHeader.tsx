import { type HTMLProps } from 'react';

import { SearchFilter, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { DATE_OPTIONS, STATUS_OPTIONS } from '../constants';
import { type IFilters } from '../types';

type Props = {
  filters: IFilters;
  // eslint-disable-next-line no-unused-vars
  onFiltersChange: (key: string, value: string) => void;
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
    onFiltersChange('status', value);
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
