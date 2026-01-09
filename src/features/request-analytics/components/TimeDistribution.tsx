import { type HTMLProps } from 'react';

import { type ProcessingTimeDistribution } from '@/services/dashboard';
import { transformTimeSeries } from '@/services/request-analytics';
import { BarChart, EmptyStateMessage, Window } from '@/shared/components';
import { cn, groupByX } from '@/shared/lib/utils';

type Props = {
  data: ProcessingTimeDistribution[];
} & Omit<HTMLProps<HTMLDivElement>, 'data'>;

export const TimeDistribution = ({ data, className, ...props }: Props) => {
  const transformedData = transformTimeSeries(data, {
    day: false,
    month: true,
    year: false,
  });

  const groupedData = groupByX(transformedData, 'date', 'approved_count');

  if (transformedData.length === 0) {
    return (
      <Window
        className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
        {...props}
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
            Processing Time Distribution
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
          Processing Time Distribution
        </h2>
      </div>

      <BarChart
        data={groupedData}
        xKey='date'
        valueKey='approved_count'
        tooltipLabel='Requests'
        height={250}
      />
    </Window>
  );
};
