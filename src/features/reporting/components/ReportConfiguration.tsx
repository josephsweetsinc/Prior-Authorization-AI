import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { type HTMLProps } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { parseApiError } from '@/services/api/types';
import { useGenerateReportMutation } from '@/services/reports';
import { Button, Select, SensitiveMessage, Window } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { FORMAT_OPTIONS } from '../constants';
import { toExactDate } from '../utils';
import { type ReportFormValues, reportSchema } from '../validation';

import { DateRangeField } from './DateRange';

const currenDate = new Date();

export const ReportConfiguration = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  const [generateReport, { isLoading }] = useGenerateReportMutation();
  const form = useForm<ReportFormValues>({
    defaultValues: {
      start_date: currenDate,
      end_date: currenDate,
      format: 'pdf',
    },
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
  });

  const handleSubmit = (data: ReportFormValues) => {
    generateReport({
      format: data.format,
      start_date: toExactDate(data.start_date),
      end_date: toExactDate(data.end_date),
    })
      .unwrap()
      .then(() => toast.success('Report generated'))
      .catch((err) => {
        const parsedError = parseApiError(err);
        toast.error(parsedError.message);
      });
  };

  return (
    <Window className={cn('space-y-5 p-5', className)} {...props}>
      <h2 className='text-brand-dark text-base font-bold md:text-lg lg:text-xl xl:text-2xl'>
        Report Configuration
      </h2>
      <FormProvider {...form}>
        <form className='space-y-5' onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='space-y-4'>
            <DateRangeField
              startName='start_date'
              endName='end_date'
              label='Date Range'
              placeholder='Select date range'
            />

            <Controller
              name='format'
              render={({ field }) => (
                <Select
                  label='Export Format'
                  placeholder='Select export format'
                  options={FORMAT_OPTIONS}
                  {...field}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </div>
          <Button
            variant='info'
            className='font-medium capitalize'
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? (
              <>
                <span>Generating...</span>
                <LoaderCircle className='size-5 animate-spin' />
              </>
            ) : (
              'Generate report'
            )}
          </Button>
        </form>
      </FormProvider>
      <SensitiveMessage
        variant='info'
        title='Report Info'
        description='Reports are generated in real-time based on current system data. Large date ranges may take longer to process.'
        withIcon
      />
    </Window>
  );
};
