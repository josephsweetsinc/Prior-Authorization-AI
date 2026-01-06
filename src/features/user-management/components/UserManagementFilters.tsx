'use client';

import { type HTMLProps } from 'react';

import { SearchFilter, Select } from '@/shared/components';

import { ROLE_OPTIONS } from '../constants';
import { type IFilters } from '../types';

type Props = {
  filters: IFilters;
  // eslint-disable-next-line no-unused-vars
  onFiltersChange: (key: string, value: string) => void;
} & HTMLProps<HTMLDivElement>;

export const UserManagementFilters = ({ filters, onFiltersChange }: Props) => {
  const handleSearchQueryChange = (value: string) => {
    onFiltersChange('searchQuery', value);
  };

  const handleRoleFilterChange = (value: string) => {
    onFiltersChange('role', value);
  };
  return (
    <section className='grid grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_0.25fr]'>
      <SearchFilter
        value={filters.searchQuery}
        labelVariant='static'
        placeholder='Search by patient or email'
        onChange={handleSearchQueryChange}
      />

      <Select
        value={filters.role}
        options={ROLE_OPTIONS}
        placeholder='Filter by role'
        onChange={handleRoleFilterChange}
      />
    </section>
  );
};
