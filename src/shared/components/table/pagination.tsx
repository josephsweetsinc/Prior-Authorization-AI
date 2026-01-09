import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { useDataTableContext } from './context';
import { useDataTablePagination } from './hooks';
import { PageButton } from './page-button';

type Props = {
  total: number;
  isLoading?: boolean;
} & HTMLProps<HTMLDivElement>;

export const DataTablePagination = ({
  isLoading,
  total,
  className,
  ...props
}: Props) => {
  const { table } = useDataTableContext();
  const {
    start,
    end,
    total: totalItems,
    currentPage,
    visiblePages,
    canPreviousPage,
    canNextPage,
  } = useDataTablePagination(table, total);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between px-2 py-3',
        className,
      )}
      {...props}
    >
      <div className='text-muted-foreground flex-1 text-sm'>
        {totalItems === 0 ? (
          'No results'
        ) : (
          <>
            Showing <strong>{start}</strong>–<strong>{end}</strong> of{' '}
            <strong>{totalItems}</strong>
          </>
        )}
      </div>

      <div className='flex w-max flex-1 items-center justify-center gap-1'>
        <PageButton
          disabled={isLoading || !canPreviousPage}
          onClick={() => table.previousPage()}
        >
          <ChevronLeft className='h-4 w-4' />
        </PageButton>

        {visiblePages.map((page, idx) =>
          page === '…' ? (
            <span
              key={`ellipsis-${idx}`}
              className='text-muted-foreground px-2'
            >
              …
            </span>
          ) : (
            <PageButton
              key={page}
              active={page === currentPage}
              disabled={isLoading}
              onClick={() => table.setPageIndex(page - 1)}
            >
              {page}
            </PageButton>
          ),
        )}

        <PageButton
          disabled={isLoading || !canNextPage}
          onClick={() => table.nextPage()}
        >
          <ChevronRight className='h-4 w-4' />
        </PageButton>
      </div>

      <div className='flex-1' />
    </div>
  );
};
