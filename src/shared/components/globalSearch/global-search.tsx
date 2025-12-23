'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

import { Input } from '../inputs';

const globalSearchVariants = cva('min-w-[288px] w-full', {
  variants: {
    size: {
      small: 'max-w-1/3',
      medium: 'max-w-1/2',
      large: 'max-w-2/3 ',
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

export type GlobalSearchProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  'size'
> &
  VariantProps<typeof globalSearchVariants>;

const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type='search'
        className={cn(globalSearchVariants({ size }), className)}
        {...props}
      />
    );
  },
);

GlobalSearch.displayName = 'GlobalSearch';

export { GlobalSearch };
