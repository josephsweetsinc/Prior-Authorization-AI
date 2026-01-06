'use client';

import { useFilters } from '@/shared/hooks/useFilters';

import { type AuthorizationRequestsFilters } from '../types';

const DEFAULT_FILTERS: AuthorizationRequestsFilters = {
  searchQuery: '',
  status: 'all',
  date: 'all',
};

export const useAuthorizationRequestsFilters = () => {
  return useFilters(DEFAULT_FILTERS);
};
