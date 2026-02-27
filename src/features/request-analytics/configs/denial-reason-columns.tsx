import { type ColumnDef } from '@tanstack/react-table';

import { type DenialReason } from '@/services/dashboard';
import { TableHeadCell } from '@/shared/components';

import { DENIAL_REASON_MAP } from '../constants';

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
