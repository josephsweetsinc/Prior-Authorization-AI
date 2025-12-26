import { type HTMLProps } from 'react';

import { type RequestsByStatus } from '@/services/dashboard';
import { transformRequestsByStatus } from '@/services/request-analytics';
import { DonutChart, EmptyStateMessage, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = {
  data: RequestsByStatus[];
} & Omit<HTMLProps<HTMLDivElement>, 'data'>;

export const RequestsByStatusChart = ({ data, className, ...props }: Props) => {
  const transformedData = transformRequestsByStatus(data);

  if (transformedData.length === 0) {
    return (
      <Window
        className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
        {...props}
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
            Requests by Status
          </h2>
        </div>
        <EmptyStateMessage message='No requests found' />
      </Window>
    );
  }

  return (
    <Window
      className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
      {...props}
    >
      <div className='flex items-center justify-between'>
        <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
          Requests by Status
        </h2>
      </div>

      <DonutChart data={transformedData} />
    </Window>
  );
};
