import { type PaginationState } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface NotificationsPaginationProps {
  pagination: PaginationState;
  onPaginationChange: (_state: PaginationState) => void;
  total: number;
  totalPages: number;
}

export const NotificationsPagination = ({
  pagination,
  onPaginationChange,
  total,
  totalPages,
}: NotificationsPaginationProps) => {
  const { pageIndex, pageSize } = pagination;

  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const visiblePages = getVisiblePages(pageIndex + 1, totalPages);

  const previousPage = () => {
    if (canPreviousPage) {
      onPaginationChange({
        ...pagination,
        pageIndex: pageIndex - 1,
      });
    }
  };

  const nextPage = () => {
    if (canNextPage) {
      onPaginationChange({
        ...pagination,
        pageIndex: pageIndex + 1,
      });
    }
  };

  const setPageIndex = (page: number) => {
    onPaginationChange({
      ...pagination,
      pageIndex: page,
    });
  };

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

function getVisiblePages(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '…', total];
  }

  if (current >= total - 3) {
    return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, '…', current - 1, current, current + 1, '…', total];
}
