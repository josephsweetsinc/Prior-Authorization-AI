'use client';

import { useState } from 'react';

import { type AuthorizationRequestsFilters } from '../types';

export const useAuthorizationRequestsFilters = () => {
  const [filters, setFilters] = useState<AuthorizationRequestsFilters>({
    searchQuery: '',
    status: 'all',
    date: 'all',
  });

  const handleFiltersChange = <Key extends keyof AuthorizationRequestsFilters>(
    key: Key,
    value: AuthorizationRequestsFilters[Key],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { filters, handleFiltersChange };
};
