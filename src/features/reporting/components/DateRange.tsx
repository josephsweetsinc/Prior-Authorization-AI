'use client';

import { format } from 'date-fns';
import { type HTMLProps } from 'react';
import { type DateRange } from 'react-day-picker';
import { useController, useFormContext } from 'react-hook-form';

import { CalendarIcon } from '@/shared/assets/icons';
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components';

import { DATE_RANGE_DISPLAY_FORMAT } from '../constants';

type DateRangeFieldProps = {
  startName: string;
  endName: string;
  label?: string;
  placeholder?: string;
} & HTMLProps<HTMLButtonElement>;

export const DateRangeField = ({
  startName,
  endName,
  label,
  placeholder = 'Select date range',
}: DateRangeFieldProps) => {
  const { control } = useFormContext();

  const { field: startField } = useController({
    name: startName,
    control,
  });

  const { field: endField } = useController({
    name: endName,
    control,
  });

  const dateRange = {
    from: startField.value,
    to: endField.value,
  };

  const formattedValue = dateRange
    ? `${format(dateRange.from, DATE_RANGE_DISPLAY_FORMAT)} - ${format(dateRange.to, DATE_RANGE_DISPLAY_FORMAT)}`
    : null;

  const handleSelect = (range?: DateRange) => {
    if (!range) {
      return;
    }

    startField.onChange(range.from);
    endField.onChange(range.to);
  };

  return (
    <div className='flex w-full gap-4'>
      <div className='flex w-full flex-col gap-3'>
        <Label htmlFor='date-picker' className='px-1'>
          {label}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='default'
              id='date-picker'
              className='w-full justify-between font-normal'
            >
              {formattedValue ?? placeholder}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              numberOfMonths={1}
              toYear={2100}
              fromYear={1900}
              captionLayout='dropdown'
              selected={dateRange}
              defaultMonth={dateRange.from}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
