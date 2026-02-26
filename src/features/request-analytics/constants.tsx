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
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return (
        <p className='text-brand-dark font-bold'>{DENIAL_REASON_MAP[value]}</p>
      );
    },
  },
  {
    accessorKey: 'count',
    header: () => <TableHeadCell className='text-sm'>Count</TableHeadCell>,
    cell: ({ getValue }) => (
      <p className='text-brand-dark font-bold'>{getValue<string>()}</p>
    ),
  },
];

export const DENIAL_REASON_MAP: Record<string, string> = {
  invalid_request_type: 'Incomplete request type',
  transport_level_not_medically_necessary:
    'Transport level not medically necessary',
  missing_physician_signature: 'Missing physician signature',
  duplicate_request: 'Duplicate request',
  incomplete_medical_documentation: 'Incomplete medical documentation',
  outdated_or_expired_documents: 'Outdated or expired documents',
  other_reason: 'Other reason',
  incorrect_or_inconsistent_patient_information:
    'Incorrect or Inconsistent Patient Information',
  invalid_diagnosis_code: 'Invalid Diagnosis Code',
};
