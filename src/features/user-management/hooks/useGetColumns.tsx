import { type ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';

import { type UserRoles } from '@/services';
import { type IUserEntry } from '@/services/user-management';
import { TableHeadCell } from '@/shared/components';

import { StatusChip } from '../components';
import { formatLastLogin } from '../utils';

interface Params {
  // eslint-disable-next-line no-unused-vars
  onDelete: (user: IUserEntry) => void;
}

export const useGetColumns = ({ onDelete }: Params) => {
  const columns: ColumnDef<IUserEntry>[] = [
    {
      id: 'patient',
      accessorKey: 'full_name',
      header: () => <TableHeadCell>Patient</TableHeadCell>,
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
      header: () => <TableHeadCell>Actions</TableHeadCell>,
      cell: ({ row }) => (
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
            onClick={() => onDelete(row.original)}
            disabled
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  return columns;
};
