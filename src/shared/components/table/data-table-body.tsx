import { flexRender } from '@tanstack/react-table';
import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { useDataTableContext } from './context';
import { DataTableSkeleton } from './data-table-skeleton';
import { TableBody, TableRow, TableCell } from './table';

type Props = {
  isLoading?: boolean;
} & HTMLProps<HTMLTableSectionElement>;

export const DataTableBody = ({ isLoading, className, ...props }: Props) => {
  const { table, columnsLength } = useDataTableContext();
  const rows = table.getRowModel().rows;

  if (isLoading) {
    return <DataTableSkeleton columnCount={columnsLength} />;
  }

  return (
    <TableBody className={cn('bg-white', className)} {...props}>
      {rows.length ? (
        rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className='p-5'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columnsLength} className='h-24 text-center'>
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
