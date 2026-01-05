import { type ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';

import { type UserRoles } from '@/services';
import { TableHeadCell } from '@/shared/components';

import { StatusChip } from '../components';
import { type IUserEntry } from '../types/types';
import { formatLastLogin } from '../utils';

interface Params {
  onDelete: VoidFunction;
}

export const useGetColumns = ({ onDelete }: Params) => {
  const columns: ColumnDef<IUserEntry>[] = [
    {
      id: 'patient',
      header: () => <TableHeadCell>Patient</TableHeadCell>,
      accessorFn: (row) => `${row.name} ${row.surname}`,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: () => <TableHeadCell>Email</TableHeadCell>,
    },
    {
      accessorKey: 'role',
      header: () => <TableHeadCell>Role</TableHeadCell>,
      cell: ({ getValue }) => (
        <span className='font-bold capitalize'>{getValue<UserRoles>()}</span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: () => <TableHeadCell>Status</TableHeadCell>,
      cell: ({ getValue }) => (
        <StatusChip status={getValue<boolean>() ? 'active' : 'inactive'} />
      ),
    },
    {
      accessorKey: 'last_login',
      header: () => <TableHeadCell>Last login</TableHeadCell>,
      cell: ({ getValue }) => formatLastLogin(getValue<string>()),
    },
    {
      id: 'actions',
      header: () => <TableHeadCell className=''>Actions</TableHeadCell>,
      cell: () => (
        <div className='flex items-center gap-3'>
          <button
            className='text-status-info flex items-center gap-1 underline'
            disabled
          >
            <Edit />
            <span>Edit</span>
          </button>
          <button
            className='text-status-destructive underline'
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  return columns;
};
