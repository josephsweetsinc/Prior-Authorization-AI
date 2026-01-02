import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { type RequestStatus } from '@/services/dashboard';
import { type IRequest } from '@/services/requests-history';
import {
  DiagnosisCell,
  RequestsHeadCell,
  RequestStatusChip,
} from '@/shared/components';

export const DAY_MS = 24 * 60 * 60 * 1000;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
];

export const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7-days', label: 'Last 7 Days' },
  { value: '30-days', label: 'Last 30 Days' },
  { value: '90-days', label: 'Last 90 Days' },
  { value: 'year', label: 'This Year' },
];

export const columns: ColumnDef<IRequest>[] = [
  {
    id: 'patient_full_name',
    accessorFn: (row) => row.patient_first_name + ' ' + row.patient_last_name,
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
    accessorKey: 'primary_diagnosis',
    header: () => <RequestsHeadCell>Diagnosis</RequestsHeadCell>,
    cell: ({ getValue }) => <DiagnosisCell diagnosis={getValue<string>()} />,
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
