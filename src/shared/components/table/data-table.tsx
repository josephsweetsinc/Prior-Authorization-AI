import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { type HTMLProps } from 'react';

import { DataTableContext } from './context';
import { DataTableBody } from './data-table-body';
import { DataTableHeader } from './data-table-header';
import { DataTablePagination } from './pagination';
import { Table } from './table';

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  manualPagination?: boolean;
  pageCount?: number;
  paginationState?: PaginationState;
  total?: number;
  onPaginationChange?: (_state: PaginationState) => void;
} & Omit<HTMLProps<HTMLDivElement>, 'data' | 'ref'>;

const DataTableRoot = <TData, TValue>({
  columns,
  data,
  pagination,
  manualPagination,
  pageCount,
  paginationState,
  onPaginationChange,
  children,
  total,
}: Props<TData, TValue>) => {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination &&
      !manualPagination && {
        getPaginationRowModel: getPaginationRowModel(),
      }),
    ...(manualPagination && {
      manualPagination: true,
      pageCount,
      state: { pagination: paginationState },
      onPaginationChange: (updater) => {
        if (!paginationState || !onPaginationChange) {
          return;
        }
        const next =
          typeof updater === 'function' ? updater(paginationState) : updater;
        onPaginationChange(next);
      },
    }),
  });

  return (
    <DataTableContext.Provider value={{ table, columnsLength: columns.length }}>
      <div className='w-full'>
        <div className='overflow-hidden rounded-md'>
          <Table>{children}</Table>
        </div>
        {pagination && <DataTablePagination total={total ?? 0} />}
      </div>
    </DataTableContext.Provider>
  );
};

export default Object.assign(DataTableRoot, {
  Header: DataTableHeader,
  Body: DataTableBody,
});
