'use client';

import { type PaginationState } from '@tanstack/react-table';

import { type AuthorizationRequestsResponse } from '@/services/requests';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { useAuthorizationRequestsColumns } from '../hooks';

type Props = {
  isLoading: boolean;
  data?: AuthorizationRequestsResponse;
  paginationState: PaginationState;
  onPaginationChange: (_state: PaginationState) => void;
};

export const AuthorizationRequestsTable = ({
  isLoading,
  data,
  paginationState,
  onPaginationChange,
}: Props) => {
  const columns = useAuthorizationRequestsColumns();

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  return (
    <DataTable
      total={data ? data.total : paginationState.pageSize}
      columns={columns}
      data={data ? data.items : []}
      pagination
      manualPagination
      pageCount={data ? data.total_pages : 1}
      paginationState={paginationState}
      onPaginationChange={onPaginationChange}
    />
  );
};
