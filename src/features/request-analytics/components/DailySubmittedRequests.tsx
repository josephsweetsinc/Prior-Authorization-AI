import { type HTMLProps } from 'react';

import { type ProviderDailySubmittedRequests } from '@/services/dashboard';
import { transformTimeSeries } from '@/services/request-analytics';
import { BarChart, EmptyStateMessage, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { ChangeIndicator } from './ChangeRateIndicator';

type Props = {
  data: ProviderDailySubmittedRequests;
} & Omit<HTMLProps<HTMLDivElement>, 'data'>;

export const DailySubmittedRequests = ({
  data,
  className,
  ...props
}: Props) => {
  const transformedData = transformTimeSeries(data.days, {
    day: true,
    month: false,
    year: false,
  });

  if (transformedData.length === 0) {
    return (
      <Window
        className={cn('flex flex-col justify-between gap-7.25 p-5', className)}
        {...props}
      >
        <div className='flex items-center justify-between gap-8'>
          <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
            Daily Submitted Requests
          </h2>
          <ChangeIndicator
            total={data.total}
            changeRate={data.change_percent}
          />
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
      <div className='flex items-center justify-between gap-8'>
        <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
          Daily Submitted Requests
        </h2>
        <ChangeIndicator total={data.total} changeRate={data.change_percent} />
      </div>

      <BarChart
        data={transformedData}
        xKey='date'
        valueKey='count'
        tooltipLabel='Requests'
        height={250}
      />
    </Window>
  );
};
