'use client';

import { type HTMLProps } from 'react';

import { DataTable, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { reportsColumns } from '../columns';
import { MOCK_RECENT_REPORTS } from '../constants';

export const RecentReports = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  return (
    <Window className={cn('space-y-5 p-5', className)} {...props}>
      <h2 className='text-brand-dark text-base font-bold md:text-lg lg:text-xl xl:text-2xl'>
        Recent Reports
      </h2>
      <DataTable columns={reportsColumns} data={MOCK_RECENT_REPORTS} />
    </Window>
  );
};
