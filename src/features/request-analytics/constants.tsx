import { type ColumnDef } from '@tanstack/react-table';

import {
  type RequestStatus,
  type ProviderRequestProgress,
} from '@/services/dashboard';
import { type DenialReason } from '@/services/dashboard/types/types';
import {
  Progress,
  RequestsHeadCell,
  RequestStatusChip,
} from '@/shared/components';

export const requestsInProgressColumns: ColumnDef<ProviderRequestProgress>[] = [
  {
    accessorKey: 'full_name',
    header: () => (
      <RequestsHeadCell className='text-sm'> Name</RequestsHeadCell>
    ),
  },
  {
    accessorKey: 'status',
    header: () => (
      <RequestsHeadCell className='text-sm'>Status</RequestsHeadCell>
    ),
    cell: ({ getValue }) => (
      <RequestStatusChip status={getValue<RequestStatus>()} />
    ),
  },
  {
    accessorKey: 'progress',
    header: () => (
      <RequestsHeadCell className='text-sm'>Progress</RequestsHeadCell>
    ),

    cell: ({ getValue }) => <Progress value={getValue<number>()} max={3} />,
  },
];

export const denialReasonsColumns: ColumnDef<DenialReason>[] = [
  {
    accessorKey: 'reason',
    header: () => (
      <RequestsHeadCell className='text-sm'>Reason</RequestsHeadCell>
    ),
    cell: ({ getValue }) => (
      <p className='text-brand-dark font-bold'>{getValue<string>()}</p>
    ),
  },
  {
    accessorKey: 'count',
    header: () => (
      <RequestsHeadCell className='text-sm'>Count</RequestsHeadCell>
    ),
    cell: ({ getValue }) => (
      <p className='text-brand-dark font-bold'>{getValue<string>()}</p>
    ),
  },
];
