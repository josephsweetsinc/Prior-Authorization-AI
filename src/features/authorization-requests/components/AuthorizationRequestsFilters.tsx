import { type HTMLProps } from 'react';

import {
  DATE_OPTIONS,
  STATUS_OPTIONS,
} from '@/features/requests-history/constants';
import { SearchFilter, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { type AuthorizationRequestsFilters } from '../types';

type Props = {
  filters: AuthorizationRequestsFilters;
  // eslint-disable-next-line no-unused-vars
  onFiltersChange: <Key extends keyof AuthorizationRequestsFilters>(
    key: Key,
    value: AuthorizationRequestsFilters[Key],
  ) => void;
} & HTMLProps<HTMLDivElement>;

export const AuthorizationRequestsFilters = ({
  filters,
  onFiltersChange,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 lg:flex-row lg:items-center',
        className,
      )}
      {...props}
    >
      <SearchFilter
        value={filters.searchQuery}
        onChange={(value) => onFiltersChange('searchQuery', value)}
        placeholder='Search by Patient, ID or request...'
        className='lg:flex-1'
      />
      <Select
        options={DATE_OPTIONS}
        value={filters.date}
        onChange={(value) =>
          onFiltersChange('date', value as AuthorizationRequestsFilters['date'])
        }
        className='lg:w-44'
      />
      <Select
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(value) =>
          onFiltersChange(
            'status',
            value as AuthorizationRequestsFilters['status'],
          )
        }
        className='lg:w-44'
      />
    </div>
  );
};
