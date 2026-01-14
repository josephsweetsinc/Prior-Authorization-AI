import { type ColumnDef } from '@tanstack/react-table';

import {
  type RequestStatus,
  type ProviderRequestProgress,
} from '@/services/dashboard';
import { type DenialReason } from '@/services/dashboard/types/types';
import { Progress, TableHeadCell, StatusChip } from '@/shared/components';

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

export const denialReasonsColumns: ColumnDef<DenialReason>[] = [
  {
    accessorKey: 'reason',
    header: () => <TableHeadCell className='text-sm'>Reason</TableHeadCell>,
    cell: ({ getValue }) => (
      <p className='text-brand-dark font-bold'>{getValue<string>()}</p>
    ),
  },
  {
    accessorKey: 'count',
    header: () => <TableHeadCell className='text-sm'>Count</TableHeadCell>,
    cell: ({ getValue }) => (
      <p className='text-brand-dark font-bold'>{getValue<string>()}</p>
    ),
  },
];
