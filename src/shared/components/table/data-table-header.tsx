import { flexRender } from '@tanstack/react-table';
import { type HTMLProps } from 'react';

import { useDataTableContext } from './context';
import { TableHeader, TableRow, TableHead } from './table';

export const DataTableHeader = (props: HTMLProps<HTMLTableSectionElement>) => {
  const { table } = useDataTableContext();

  return (
    <TableHeader {...props}>
      {table.getHeaderGroups().map((group) => (
        <TableRow key={group.id}>
          {group.headers.map((header) => (
            <TableHead key={header.id} className='p-5'>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
};
