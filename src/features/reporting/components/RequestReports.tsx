'use client';

import { Info } from 'lucide-react';
import { type HTMLProps } from 'react';

import { MetricsCard } from '@/features/request-totals/components';
import {
  DataTable,
  OverlayIcon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Window,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { metricColumns } from '../columns';
import { MOCK_METRICS } from '../constants';

export const RequestReports = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  return (
    <Window className={cn('space-y-5 p-5', className)} {...props}>
      <div className='flex flex-wrap items-center justify-between gap-6'>
        <h2 className='text-brand-dark text-base font-bold md:text-lg lg:text-xl xl:text-2xl'>
          Requests Report
        </h2>
        <Tooltip>
          <TooltipTrigger>
            <Info className='text-muted-blue size-4.5' />
          </TooltipTrigger>
          <TooltipContent side='bottom' className='w-max'>
            <p className='max-w-[449px] min-w-[288px]'>
              This preview shows a summary of the data that will be included in
              your report. The full report will contain detailed breakdowns,
              charts, and analysis based on your selected criteria.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='flex flex-wrap items-center gap-5'>
        <MetricsCard className='flex shrink grow basis-33.5 items-center gap-2.5 bg-neutral-100/40 px-5 py-2.5'>
          <OverlayIcon variant='FileText' color='green' />
          <MetricsCard.Group>
            <MetricsCard.Label>Total Data Points</MetricsCard.Label>
            <MetricsCard.Value>8,432</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard>
        <MetricsCard className='flex shrink grow basis-33.5 items-center gap-2.5 bg-neutral-100/40 px-5 py-2.5'>
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
