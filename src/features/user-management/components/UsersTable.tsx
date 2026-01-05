'use client';

import { type HTMLProps } from 'react';

import { DataTable } from '@/shared/components';

import { useGetColumns } from '../hooks/useGetColumns';
import { type IUserEntry } from '../types';

type Props = {
  data: IUserEntry[];
} & Omit<HTMLProps<HTMLElement>, 'data'>;

export const UsersTable = ({ data, ...props }: Props) => {
  const columns = useGetColumns();

  return <DataTable columns={columns} data={data} pagination {...props} />;
};
