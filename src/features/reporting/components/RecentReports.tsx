'use client';

import { type HTMLProps } from 'react';

import { type IReport } from '@/services/reports';
import { DataTable, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { reportsColumns } from '../columns';

type Props = {
  reports: IReport[];
  isLoading: boolean;
} & HTMLProps<HTMLDivElement>;

export const RecentReports = ({
  reports,
  isLoading,
  className,
  ...props
}: Props) => {
  return (
    <Window className={cn('space-y-5 p-5', className)} {...props}>
      <h2 className='text-brand-dark text-base font-bold md:text-lg lg:text-xl xl:text-2xl'>
        Recent Reports
      </h2>
      <DataTable columns={reportsColumns} data={reports}>
        <DataTable.Header />
        <DataTable.Body isLoading={isLoading} />
      </DataTable>
    </Window>
  );
};
