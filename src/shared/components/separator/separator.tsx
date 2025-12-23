'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const separatorVariants = cva(
  'shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
  {
    variants: {
      color: {
        success: 'bg-status-success',
        info: 'bg-status-info',
        warning: 'bg-status-warning',
        destructive: 'bg-status-destructive',
      },
    },
    defaultVariants: {
      color: 'info',
    },
  },
);

export type SeparatorColor = VariantProps<typeof separatorVariants>['color'];

export type SeparatorProps = React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
> &
  VariantProps<typeof separatorVariants>;

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      color,
      ...props
    },
    ref,
  ) => {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        data-slot='separator'
        className={cn(separatorVariants({ color }), className)}
        {...props}
      />
    );
  },
);

Separator.displayName = 'Separator';

export { Separator };
