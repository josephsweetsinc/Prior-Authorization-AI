import { useState } from 'react';

export const useFilters = <TFilters extends object>(
  defaultFilters: TFilters,
) => {
  const [filters, setFilters] = useState<TFilters>(defaultFilters);

  const handleFiltersChange = <Key extends keyof TFilters>(
    key: Key,
    value: TFilters[Key],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { filters, setFilters, handleFiltersChange };
};
