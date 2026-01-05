'use client';

import { useState } from 'react';

import { usersMock } from '../constants';
import { type IFilters } from '../types';
import { filterPipeline } from '../utils/pipelines';

import { UserManagementFilters } from './UserManagementFilters';
import { UsersTable } from './UsersTable';

export const UserManagementContainer = () => {
  const [filters, setFilters] = useState<IFilters>({
    searchQuery: '',
    role: 'all',
  });

  const data = usersMock;

  const filteredData = filterPipeline(data ?? [], filters);

  const handleFiltersChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <UserManagementFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <UsersTable data={filteredData} />
    </>
  );
};
