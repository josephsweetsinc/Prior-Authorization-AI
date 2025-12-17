'use client';

import * as React from 'react';

import { CalendarIcon } from '@/shared/assets/icons';

import { Button } from '../button';
import { Calendar } from '../calendar';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export function DateInput({ label }: { label?: string }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className='flex w-full gap-4'>
      <div className='flex w-full flex-col gap-3'>
        <Label htmlFor='date-picker' className='px-1'>
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='default'
              id='date-picker'
              className='w-full justify-between font-normal'
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={date}
              toYear={2100}
              fromYear={1900}
              captionLayout='dropdown'
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
