'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable as createReactTable,
  getPaginationRowModel,
  type PaginationState,
} from '@tanstack/react-table';

import { DataTablePagination } from './pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  manualPagination?: boolean;
  pageCount?: number;
  paginationState?: PaginationState;
  total?: number;
  // eslint-disable-next-line no-unused-vars
  onPaginationChange?: (state: PaginationState) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = false,
  manualPagination,
  pageCount,
  paginationState,
  onPaginationChange,
  total,
}: DataTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = createReactTable({
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
      state: {
        pagination: paginationState,
      },
      onPaginationChange: (updater) => {
        if (!paginationState || !onPaginationChange) {
          return;
        }

        const nextState =
          typeof updater === 'function' ? updater(paginationState) : updater;

        onPaginationChange(nextState);
      },
    }),
  });

  return (
    <div className='w-full'>
      <div className='overflow-hidden rounded-md'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className='p-5' key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='bg-white'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='p-5' key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} total={total ?? 0} />}
    </div>
  );
}
