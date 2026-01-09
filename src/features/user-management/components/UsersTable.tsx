'use client';

import { type PaginationState } from '@tanstack/react-table';
import { type HTMLProps } from 'react';

import {
  type IGetUsersResponse,
  type IUserEntry,
} from '@/services/user-management';
import { DataTable } from '@/shared/components';

import { useGetColumns } from '../hooks/useGetColumns';

type Props = {
  isLoading: boolean;
  data?: IGetUsersResponse;
  onUpdateClick: (_user: IUserEntry) => void;
  onDeleteClick: (_user: IUserEntry) => void;
  paginationState: PaginationState;
  onPaginationChange: (_state: PaginationState) => void;
} & Omit<HTMLProps<HTMLElement>, 'data'>;

export const UsersTable = ({
  isLoading,
  data,

  onDeleteClick,
  onUpdateClick,
  paginationState,
  onPaginationChange,
  ...props
}: Props) => {
  const columns = useGetColumns({
    onUpdate: onUpdateClick,
    onDelete: onDeleteClick,
  });

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
      {...props}
    >
      <DataTable.Header />
      <DataTable.Body isLoading={isLoading} />
    </DataTable>
  );
};
