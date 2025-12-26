import { type HTMLProps } from 'react';

import { type DenialReason } from '@/services/dashboard';
import { DataTable, EmptyStateMessage, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { denialReasonsColumns } from '../constants';

type Props = {
  data: DenialReason[];
} & Omit<HTMLProps<HTMLDivElement>, 'data'>;

export const DenialReasons = ({ data, className, ...props }: Props) => {
  if (data.length === 0) {
    return (
      <Window
        className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
        {...props}
      >
        <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
          Common Denial Reasons
        </h2>
        <EmptyStateMessage message='Unable to find denial reasons data' />
      </Window>
    );
  }

  return (
    <Window
      className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
      {...props}
    >
      <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
        Requests in Progress
      </h2>

      <DataTable columns={denialReasonsColumns} data={data} />
    </Window>
  );
};
