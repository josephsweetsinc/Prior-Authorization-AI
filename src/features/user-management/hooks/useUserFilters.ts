import { useState } from 'react';

import { type IFilters } from '../types';

export const useUserFilters = () => {
  const [filters, setFilters] = useState<IFilters>({
    searchQuery: '',
    role: 'provider',
  });

  const handleFiltersChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return { filters, handleFiltersChange };
};
