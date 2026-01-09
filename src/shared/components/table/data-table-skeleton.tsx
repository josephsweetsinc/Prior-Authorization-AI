'use client';

import { Skeleton } from '../skeleton';

import { TableBody, TableCell, TableRow } from './table';

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

function SkeletonCell() {
  return <Skeleton className='bg-secondary h-6 w-full rounded-md' />;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 5,
}: DataTableSkeletonProps) {
  return (
    <TableBody className='bg-white'>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <SkeletonCell />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
