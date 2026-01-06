'use client';

import { type PaginationState } from '@tanstack/react-table';
import { type HTMLProps } from 'react';

import {
  type IGetUsersResponse,
  type IUserEntry,
} from '@/services/user-management';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { useGetColumns } from '../hooks/useGetColumns';

type Props = {
  isLoading: boolean;
  data?: IGetUsersResponse;
  // eslint-disable-next-line no-unused-vars
  onUpdateClick: (user: IUserEntry) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteClick: (user: IUserEntry) => void;
  paginationState: PaginationState;
  // eslint-disable-next-line no-unused-vars
  onPaginationChange: (state: PaginationState) => void;
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

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} {...props} />;
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
      {...props}
    />
  );
};
