'use client';

import { type HTMLProps } from 'react';

import {
  selectRecentReports,
  selectReportStatistics,
  useGetRecentReportsQuery,
} from '@/services/reports';
import { cn } from '@/shared/lib/utils';

import { RecentReports } from './RecentReports';
import { ReportConfiguration } from './ReportConfiguration';
import { RequestReports } from './RequestReports';

export const ReportContainer = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const { data, isLoading, isFetching } = useGetRecentReportsQuery();

  const stats = selectReportStatistics(data);
  const reports = selectRecentReports(data);

  return (
    <div
      className={cn('flex flex-wrap items-stretch gap-5', className)}
      {...props}
    >
      <ReportConfiguration className='max-w-full shrink grow basis-[288px] overflow-x-auto' />
      <RequestReports
        stats={stats}
        isLoading={isLoading}
        className='max-w-full shrink grow basis-xl overflow-x-auto'
      />
      <RecentReports
        reports={reports ?? []}
        isLoading={isFetching}
        className='max-w-full shrink grow basis-full overflow-x-auto'
      />
    </div>
  );
};
