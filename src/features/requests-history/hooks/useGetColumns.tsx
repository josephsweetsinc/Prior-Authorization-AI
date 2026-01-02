import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

import { type RequestStatus } from '@/services/dashboard';
import { type IRequest } from '@/services/requests-history';
import {
  DiagnosisCell,
  RequestsHeadCell,
  RequestStatusChip,
} from '@/shared/components';

interface Params {
  // eslint-disable-next-line no-unused-vars
  onDetailsClick: (requestId: number) => void;
}

export const useGetColumns = ({
  onDetailsClick,
}: Params): ColumnDef<IRequest>[] => {
  return [
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
        const formattedDate = format(
          new Date(getValue<string>()),
          'MM/dd/yyyy',
        );

        return <time dateTime={formattedDate}>{formattedDate}</time>;
      },
    },
    {
      id: 'actions',
      accessorKey: 'id',
      header: () => <RequestsHeadCell>Actions</RequestsHeadCell>,
      cell: ({ getValue }) => (
        <button
          className='text-accent-foreground flex items-center gap-2'
          onClick={() => onDetailsClick(getValue<number>())}
        >
          <span>More Details</span>
          <ArrowUpRight className='text-status-info size-5' />
        </button>
      ),
    },
  ];
};
