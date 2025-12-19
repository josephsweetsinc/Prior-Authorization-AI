'use client';

import { Check } from 'lucide-react';
import * as React from 'react';
import { useId } from 'react';

import { cn } from '@/shared/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className='flex items-center gap-2.5'>
        <div className='relative flex items-center'>
          <input
            type='checkbox'
            id={inputId}
            ref={ref}
            className={cn(
              'peer ring-offset-background focus-visible:ring-ring checked:bg-accent-foreground h-4.5 w-4.5 shrink-0 appearance-none rounded-xs border-2 border-[#232323] checked:border-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          />
          <Check className='pointer-events-none absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100' />
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className='text-md cursor-pointer leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
