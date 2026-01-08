import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { RecentReports } from './RecentReports';
import { ReportConfiguration } from './ReportConfiguration';
import { RequestReports } from './RequestReports';

export const ReportContainer = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex flex-wrap items-stretch gap-5', className)}
      {...props}
    >
      <ReportConfiguration className='max-w-full shrink grow basis-[288px] overflow-x-auto' />
      <RequestReports className='max-w-full shrink grow basis-xl overflow-x-auto' />
      <RecentReports className='max-w-full shrink grow basis-full overflow-x-auto' />
    </div>
  );
};
