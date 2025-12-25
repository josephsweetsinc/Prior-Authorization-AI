import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { type RequestStatus, type RecentRequest } from '@/services/dashboard';

import { RequestsHeadCell } from './components/RequestsHeadCell';
import { RequestStatusChip } from './components/RequestStatusChip';

export const columns: ColumnDef<RecentRequest>[] = [
  {
    accessorKey: 'patient_full_name',
    header: () => <RequestsHeadCell>Patient</RequestsHeadCell>,
  },
  {
    accessorKey: 'id',
    header: () => <RequestsHeadCell>MRN</RequestsHeadCell>,
    cell: ({ getValue }) => (
      <span className='font-bold text-black'>{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'diagnosis',
    header: () => <RequestsHeadCell>Diagnosis</RequestsHeadCell>,
  },
  {
    accessorKey: 'status',
    header: () => <RequestsHeadCell>Status</RequestsHeadCell>,
    cell: ({ getValue }) => (
      <RequestStatusChip status={getValue<RequestStatus>()} />
    ),
  },
  {
    accessorKey: 'created_at',
    header: () => <RequestsHeadCell>Date</RequestsHeadCell>,
    cell: ({ getValue }) => {
      const formattedDate = new Date(getValue<string>()).toLocaleDateString();

      return <time dateTime={formattedDate}>{formattedDate}</time>;
    },
  },
  {
    id: 'actions',
    header: () => <RequestsHeadCell>Actions</RequestsHeadCell>,

    cell: () => (
      <Link
        className='text-accent-foreground pointer-events-none flex items-center gap-2'
        href='/'
      >
        <span>More Details</span>
        <ArrowUpRight className='text-status-info size-5' />
      </Link>
    ),
  },
];
