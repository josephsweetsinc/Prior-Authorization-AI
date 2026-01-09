'use client';

import { type HTMLProps } from 'react';

import { MetricsCard } from '@/features/request-totals/components';
import { DataTable, OverlayIcon, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { metricColumns } from '../columns';
import { MOCK_METRICS } from '../constants';

export const RequestReports = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  return (
    <Window className={cn('space-y-5 p-5', className)} {...props}>
      <h2 className='text-brand-dark text-base font-bold md:text-lg lg:text-xl xl:text-2xl'>
        Requests Report
      </h2>
      <div className='flex flex-wrap items-center gap-5'>
        <MetricsCard className='flex shrink grow basis-33.5 items-center gap-2.5 bg-neutral-50/50 px-5 py-2.5'>
          <OverlayIcon variant='FileText' color='green' />
          <MetricsCard.Group>
            <MetricsCard.Label>Total Data Points</MetricsCard.Label>
            <MetricsCard.Value>8,432</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard>
        <MetricsCard className='flex shrink grow basis-33.5 items-center gap-2.5 bg-neutral-50/50 px-5 py-2.5'>
          <OverlayIcon variant='Shuffle' color='orange' />
          <MetricsCard.Group>
            <MetricsCard.Label>Report Size</MetricsCard.Label>
            <MetricsCard.Value>2.4 MB</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard>
      </div>
      <DataTable columns={metricColumns} data={MOCK_METRICS}>
        <DataTable.Header />
        <DataTable.Body />
      </DataTable>
    </Window>
  );
};
