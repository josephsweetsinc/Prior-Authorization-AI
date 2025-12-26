import { type ColumnDef } from '@tanstack/react-table';

import {
  type RequestStatus,
  type ProviderRequestProgress,
} from '@/services/dashboard';
import {
  Progress,
  RequestsHeadCell,
  RequestStatusChip,
} from '@/shared/components';

export const columns: ColumnDef<ProviderRequestProgress>[] = [
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
