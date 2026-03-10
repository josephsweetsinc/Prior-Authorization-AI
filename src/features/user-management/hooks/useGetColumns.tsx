import { type ColumnDef } from '@tanstack/react-table';
import { CircleCheck, Edit } from 'lucide-react';

import { type UserRoles } from '@/services';
import { type IUserEntry } from '@/services/user-management';
import { TableHeadCell } from '@/shared/components';

import { StatusChip } from '../components';
import { formatLastLogin } from '../utils';

interface Params {
  onDelete: (_user: IUserEntry) => void;
  onUpdate: (_user: IUserEntry) => void;
  onApprove: (_user: IUserEntry) => void;
}

export const useGetColumns = ({ onUpdate, onDelete, onApprove }: Params) => {
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
        <StatusChip status={getValue<boolean>() ? 'active' : 'deactivated'} />
      ),
    },
    {
      accessorKey: 'last_login',
      header: () => <TableHeadCell>Last Approved</TableHeadCell>,
      cell: ({ getValue }) => formatLastLogin(getValue<string>()),
    },
    {
      id: 'actions',
      header: () => <TableHeadCell>Actions</TableHeadCell>,
      cell: ({ row }) => {
        const isDeactivated = !row.original.is_active;

        if (isDeactivated) {
          return (
            <div className='flex items-center gap-3'>
              <button
                className='text-status-info flex items-center gap-1 underline'
                onClick={() => onApprove(row.original)}
              >
                <CircleCheck />
                <span>Approve</span>
              </button>
              <button
                className='text-status-destructive underline'
                onClick={() => onDelete(row.original)}
              >
                Delete
              </button>
            </div>
          );
        }

        return (
          <div className='flex items-center gap-3'>
            <button
              className='text-status-info flex items-center gap-1 underline'
              onClick={() => onUpdate(row.original)}
            >
              <Edit />
              <span>Edit</span>
            </button>
            <button
              className='text-status-destructive underline'
              onClick={() => onDelete(row.original)}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  return columns;
};
