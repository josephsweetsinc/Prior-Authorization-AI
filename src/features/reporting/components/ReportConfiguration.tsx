import { type HTMLProps } from 'react';

import { Button, Select, SensitiveMessage, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { MOCK_DATE_RANGE_OPTIONS, MOCK_FORMAT_OPTIONS } from '../constants';

export const ReportConfiguration = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  return (
    <Window className={cn('space-y-5 p-5', className)} {...props}>
      <h2 className='text-brand-dark text-base font-bold md:text-lg lg:text-xl xl:text-2xl'>
        Report Configuration
      </h2>
      <form className='space-y-5'>
        <div className='space-y-4'>
          <Select
            label='Date Range'
            placeholder='Select date range'
            options={MOCK_DATE_RANGE_OPTIONS}
          />
          <Select
            label='Export Format'
            placeholder='Select export format'
            options={MOCK_FORMAT_OPTIONS}
          />
        </div>
        <Button variant='info' className='font-medium capitalize' disabled>
          Generate report
        </Button>
      </form>
      <SensitiveMessage
        variant='info'
        title='Report Info'
        description='Reports are generated in real-time based on current system data. Large date ranges may take longer to process.'
        withIcon
      />
    </Window>
  );
};
