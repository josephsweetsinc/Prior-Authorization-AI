import { type Table } from '@tanstack/react-table';

import { getVisiblePages } from './utils';

export function useDataTablePagination<TData>(
  table: Table<TData>,
  total: number,
) {
  const { pageIndex, pageSize } = table.getState().pagination;

  const rawPageCount = table.getPageCount();
  const pageCount = rawPageCount > 0 ? rawPageCount : 1;

  const start = total === 0 ? 0 : pageIndex * pageSize + 1;

  const end = total === 0 ? 0 : Math.min(start + pageSize - 1, total);

  const currentPage = pageIndex + 1;

  const visiblePages = getVisiblePages(currentPage, pageCount);

  return {
    start,
    end,
    total,

    pageIndex,
    pageSize,
    currentPage,
    pageCount,

    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),

    visiblePages,
  };
}
