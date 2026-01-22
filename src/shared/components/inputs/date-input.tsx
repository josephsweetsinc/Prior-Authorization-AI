'use client';

import { CircleAlert } from 'lucide-react';
import * as React from 'react';

import { CalendarIcon } from '@/shared/assets/icons';
import { cn } from '@/shared/lib/utils';

import { Button } from '../button';
import { Calendar } from '../calendar';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

type DateInputProps = {
  label?: string;
  value?: string | Date | undefined;
  onChangeAction?: (_value?: string) => void;
  error?: string | undefined;
};

function toDate(value?: string | Date) {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function formatDateToDisplay(date?: Date) {
  if (!date) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${date.getFullYear()}`;
}

function formatDateToIso(date?: Date) {
  if (!date) {
    return undefined;
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function DateInput({
  label,
  value,
  onChangeAction,
  error,
}: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const resolved = toDate(value);

  const handleSelect = (date?: Date) => {
    if (!date) {
      onChangeAction?.(undefined);
      setOpen(false);
      return;
    }
    onChangeAction?.(formatDateToIso(date));
    setOpen(false);
  };

  return (
    <div className='font-nunito-sans flex w-full gap-4'>
      <div className='flex w-full flex-col gap-1'>
        <Label htmlFor='date-picker' className='px-1 text-base font-medium'>
          {label}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='default'
              id='date-picker'
              className={cn(
                'w-full justify-between px-6! text-sm font-normal',
                { 'border-destructive': !!error },
              )}
            >
              {resolved ? formatDateToDisplay(resolved) : 'Select date'}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={resolved}
              toYear={2100}
              fromYear={1900}
              captionLayout='dropdown'
              onSelect={(d) => handleSelect(d)}
            />
          </PopoverContent>
        </Popover>

        {error && (
          <div
            className='text-destructive flex items-center gap-1 text-sm'
            role='alert'
          >
            <CircleAlert size={13} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}
