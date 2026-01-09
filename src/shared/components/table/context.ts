'use client';

import type { Table as ReactTable } from '@tanstack/react-table';
import { createContext, useContext } from 'react';

type DataTableContextValue<TData> = {
  table: ReactTable<TData>;
  columnsLength: number;
};

export const DataTableContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<DataTableContextValue<any> | null>(null);

export function useDataTableContext<TData>() {
  const ctx = useContext(DataTableContext);
  if (!ctx) {
    throw new Error('DataTable components must be used within DataTable.Root');
  }
  return ctx as DataTableContextValue<TData>;
}
