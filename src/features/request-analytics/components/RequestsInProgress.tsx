import { type HTMLProps } from 'react';

import { type ProviderRequestProgress } from '@/services/dashboard';
import { DataTable, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { columns } from '../constants';

import { EmptyStateMessage } from './EmptyStateMessage';

type Props = {
  data: ProviderRequestProgress[];
} & Omit<HTMLProps<HTMLDivElement>, 'data'>;

export const RequestsInProgress = ({ data, className, ...props }: Props) => {
  if (data.length === 0) {
    return (
      <Window className={cn('space-y-7.25 p-5', className)} {...props}>
        <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
          Requests in Progress
        </h2>
        <EmptyStateMessage />
      </Window>
    );
  }

  return (
    <Window className={cn('space-y-7.25 p-5', className)} {...props}>
      <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
        Requests in Progress
      </h2>

      <DataTable columns={columns} data={data} />
    </Window>
  );
};
