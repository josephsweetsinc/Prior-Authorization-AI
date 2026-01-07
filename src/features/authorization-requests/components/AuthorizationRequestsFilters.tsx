import { type HTMLProps } from 'react';

import {
  DATE_OPTIONS,
  STATUS_OPTIONS,
} from '@/features/requests-history/constants';
import { SearchFilter, Select } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { type AuthorizationRequestsFilters as AuthorizationRequestsFiltersType } from '../types';

type Props = {
  filters: AuthorizationRequestsFiltersType;
  onFiltersChange: <Key extends keyof AuthorizationRequestsFiltersType>(
    _key: Key,
    _value: AuthorizationRequestsFiltersType[Key],
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
          onFiltersChange(
            'date',
            value as AuthorizationRequestsFiltersType['date'],
          )
        }
        className='lg:w-44'
        triggerClassName='py-[9px] px-4 text-[14px] h-[38px]'
      />
      <Select
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(value) =>
          onFiltersChange(
            'status',
            value as AuthorizationRequestsFiltersType['status'],
          )
        }
        className='lg:w-44'
        triggerClassName='py-[9px] px-4 text-[14px] h-[38px]'
      />
    </div>
  );
};
