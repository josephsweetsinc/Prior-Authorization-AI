'use client';

import { Info } from 'lucide-react';
import { type HTMLProps } from 'react';

import { type IReportStats } from '@/services/reports';
import {
  DataTable,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Window,
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { metricColumns } from '../columns';
import { transformReportStatsToMetrics } from '../utils';

type Props = {
  stats?: IReportStats;
  isLoading: boolean;
} & HTMLProps<HTMLDivElement>;

export const RequestReports = ({
  stats,
  isLoading,
  className,
  ...props
}: Props) => {
  const transformedData = transformReportStatsToMetrics(stats);

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

      <DataTable columns={metricColumns} data={transformedData}>
        <DataTable.Header />
        <DataTable.Body isLoading={isLoading} />
      </DataTable>
    </Window>
  );
};
