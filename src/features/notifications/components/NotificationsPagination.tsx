import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { useNotificationsPagination } from '../hooks';
import { type NotificationsPaginationProps } from '../types';

export const NotificationsPagination = ({
  pagination,
  onPaginationChange,
  total,
  totalPages,
}: NotificationsPaginationProps) => {
  const {
    start,
    end,
    canPreviousPage,
    canNextPage,
    visiblePages,
    previousPage,
    nextPage,
    setPageIndex,
    pageIndex,
  } = useNotificationsPagination({
    pagination,
    onPaginationChange,
    total,
    totalPages,
  });

  return (
    <div className='flex w-full items-center justify-between px-2 py-3'>
      <div className='text-muted-foreground flex-1 text-sm'>
        Showing {end - start + 1} out of {total}
      </div>

      <div className='flex flex-1 items-center justify-center gap-1'>
        <PageButton disabled={!canPreviousPage} onClick={previousPage}>
          <ChevronLeft className='h-4 w-4' />
        </PageButton>

        {visiblePages.map((page, idx) =>
          typeof page === 'string' ? (
            <span
              key={`ellipsis-${idx}`}
              className='text-muted-foreground px-2'
            >
              …
            </span>
          ) : (
            <PageButton
              key={page}
              active={page === pageIndex + 1}
              onClick={() => setPageIndex(page - 1)}
            >
              {page}
            </PageButton>
          ),
        )}

        <PageButton disabled={!canNextPage} onClick={nextPage}>
          <ChevronRight className='h-4 w-4' />
        </PageButton>
      </div>
      <div className='flex-1' />
    </div>
  );
};

function PageButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors',
        disabled && 'cursor-not-allowed opacity-40',
        active
          ? 'bg-accent-foreground text-primary-foreground'
          : 'hover:bg-muted text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}
