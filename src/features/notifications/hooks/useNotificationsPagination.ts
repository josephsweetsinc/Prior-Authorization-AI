import { type PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';

import { getVisiblePages } from '@/shared/components/table';

export interface Params {
  pagination: PaginationState;
  onPaginationChange: (_pagination: PaginationState) => void;
  total: number;
  totalPages: number;
}

export const useNotificationsPagination = ({
  pagination,
  onPaginationChange,
  total,
  totalPages,
}: Params) => {
  const { pageIndex, pageSize } = pagination;

  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const visiblePages = useMemo(
    () => getVisiblePages(pageIndex + 1, totalPages),
    [pageIndex, totalPages],
  );

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

  return {
    start,
    end,
    canPreviousPage,
    canNextPage,
    visiblePages,
    previousPage,
    nextPage,
    setPageIndex,
    pageIndex,
  };
};
