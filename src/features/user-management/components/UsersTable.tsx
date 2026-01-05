'use client';

import { type HTMLProps } from 'react';

import { DataTable } from '@/shared/components';

import { useGetColumns } from '../hooks/useGetColumns';
import { type IUserEntry } from '../types';

type Props = {
  data: IUserEntry[];
  onUpdateClick: VoidFunction;
  onDeleteClick: VoidFunction;
} & Omit<HTMLProps<HTMLElement>, 'data'>;

export const UsersTable = ({ data, onDeleteClick, ...props }: Props) => {
  const columns = useGetColumns({ onDelete: onDeleteClick });

  return <DataTable columns={columns} data={data} pagination {...props} />;
};
