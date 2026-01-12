import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { type RecentRequest, type RequestStatus } from '@/services/dashboard';
import {
  DiagnosisCell,
  TableHeadCell,
  StatusChip,
  RequestAction,
} from '@/shared/components';

interface Params {
  // eslint-disable-next-line no-unused-vars
  onDetailsClick: (requestId: number) => void;
}

export const useGetColumns = ({
  onDetailsClick,
}: Params): ColumnDef<RecentRequest>[] => {
  return [
    {
      accessorKey: 'patient_full_name',
      header: () => <TableHeadCell>Patient</TableHeadCell>,
    },
    {
      accessorKey: 'patient_id',
      header: () => <TableHeadCell>MRN</TableHeadCell>,
      cell: ({ getValue }) => (
        <span className='font-bold text-black'>{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'diagnosis',
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
      cell: ({ row, getValue }) => (
        <RequestAction
          status={row.original.status}
          id={getValue<number>()}
          onClick={onDetailsClick}
        />
      ),
    },
  ];
};
