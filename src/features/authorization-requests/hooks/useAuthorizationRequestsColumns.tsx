import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

import { type RequestStatus } from '@/services/dashboard';
import { type AuthorizationRequest } from '@/services/requests';
import {
  DiagnosisCell,
  RequestAction,
  StatusChip,
  TableHeadCell,
} from '@/shared/components';

export const useAuthorizationRequestsColumns =
  (): ColumnDef<AuthorizationRequest>[] => {
    const router = useRouter();

    return [
      {
        accessorKey: 'id',
        header: () => <TableHeadCell>Request ID</TableHeadCell>,
        cell: ({ getValue }) => (
          <span className='text-foreground font-bold'>
            REQ-{getValue<number>()}
          </span>
        ),
      },
      {
        id: 'patient_full_name',
        accessorFn: (row) =>
          `${row.patient_first_name} ${row.patient_last_name}`,
        header: () => <TableHeadCell>Patient</TableHeadCell>,
      },
      {
        accessorKey: 'primary_diagnosis',
        header: () => <TableHeadCell>Diagnosis</TableHeadCell>,
        cell: ({ getValue }) => (
          <DiagnosisCell diagnosis={getValue<string>()} />
        ),
      },
      {
        accessorKey: 'status',
        header: () => <TableHeadCell>Status</TableHeadCell>,
        cell: ({ getValue }) => (
          <StatusChip status={getValue<RequestStatus>()} />
        ),
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
        header: () => <TableHeadCell>Action</TableHeadCell>,
        cell: ({ row, getValue }) => (
          <RequestAction
            status={row.original.status}
            id={getValue<number>()}
            onClick={(id: number) => router.push(`/requests/${id}`)}
            className='text-status-info font-medium'
          />
        ),
      },
    ];
  };
