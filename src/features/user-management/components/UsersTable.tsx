'use client';

import { type HTMLProps } from 'react';

import { type IUserEntry } from '@/services/user-management';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { useGetColumns } from '../hooks/useGetColumns';

type Props = {
  isLoading: boolean;
  data: IUserEntry[];
  onUpdateClick: VoidFunction;
  // eslint-disable-next-line no-unused-vars
  onDeleteClick: (user: IUserEntry) => void;
} & Omit<HTMLProps<HTMLElement>, 'data'>;

export const UsersTable = ({
  isLoading,
  data,
  onDeleteClick,
  ...props
}: Props) => {
  const columns = useGetColumns({ onDelete: onDeleteClick });

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} {...props} />;
  }

  return <DataTable columns={columns} data={data} pagination {...props} />;
};
