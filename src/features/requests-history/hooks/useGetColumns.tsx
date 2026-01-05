import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

import { type RequestStatus } from '@/services/dashboard';
import { type IRequest } from '@/services/requests-history';
import { DiagnosisCell, TableHeadCell, StatusChip } from '@/shared/components';

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
      header: () => <TableHeadCell>Patient</TableHeadCell>,
    },
    {
      accessorKey: 'id',
      header: () => <TableHeadCell>MRN</TableHeadCell>,
      cell: ({ getValue }) => (
        <span className='font-bold text-black'>{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'primary_diagnosis',
      header: () => <TableHeadCell>Diagnosis</TableHeadCell>,
      cell: ({ getValue }) => <DiagnosisCell diagnosis={getValue<string>()} />,
    },
    {
      accessorKey: 'status',
      header: () => <TableHeadCell>Status</TableHeadCell>,
      cell: ({ getValue }) => <StatusChip status={getValue<RequestStatus>()} />,
    },
    {
      accessorKey: 'created_at',
      header: () => <TableHeadCell>Date</TableHeadCell>,
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
      header: () => <TableHeadCell>Actions</TableHeadCell>,
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
