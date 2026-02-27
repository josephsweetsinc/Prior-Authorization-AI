import { type ColumnDef } from '@tanstack/react-table';

import {
  type RequestStatus,
  type ProviderRequestProgress,
} from '@/services/dashboard';
import { Progress, StatusChip, TableHeadCell } from '@/shared/components';

export const requestsInProgressColumns: ColumnDef<ProviderRequestProgress>[] = [
  {
    accessorKey: 'full_name',
    header: () => <TableHeadCell className='text-sm'> Name</TableHeadCell>,
  },
  {
    accessorKey: 'status',
    header: () => <TableHeadCell className='text-sm'>Status</TableHeadCell>,
    cell: ({ getValue }) => <StatusChip status={getValue<RequestStatus>()} />,
  },
  {
    accessorKey: 'progress',
    header: () => <TableHeadCell className='text-sm'>Progress</TableHeadCell>,

    cell: ({ getValue }) => <Progress value={getValue<number>()} max={4} />,
  },
];
