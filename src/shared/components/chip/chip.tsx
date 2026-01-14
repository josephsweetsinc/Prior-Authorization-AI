'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Check, X, Clock, Loader2, Info, ClockFading } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const chipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-sm font-medium transition-colors ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        success: 'bg-status-success/10 text-status-success',
        info: 'bg-status-info/10 text-status-info',
        destructive: 'bg-status-destructive/10 text-status-destructive',
        warning: 'bg-status-warning/10 text-status-warning',
        submitted: 'text-status-submitted bg-status-submitted/10',
        default: 'bg-muted text-foreground',
        outlined: 'border border-input bg-background',
      },
      size: {
        default: 'h-7 px-3 py-2.5',
        sm: 'h-6 px-2.5 text-xs',
        lg: 'h-8 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const defaultIcons = {
  success: Check,
  destructive: X,
  warning: Clock,
  info: Loader2,
  submitted: ClockFading,
  default: Info,
  outlined: null,
};

export interface ChipProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  label: string;
  icon?: React.ElementType;
  withIcon?: boolean;
}

export function Chip({
  className,
  variant,
  size,
  label,
  icon: IconProp,
  withIcon = false,
  ...props
}: ChipProps) {
  const IconComponent = IconProp || (variant ? defaultIcons[variant] : null);

  return (
    <div className={cn(chipVariants({ variant, size }), className)} {...props}>
      {withIcon && IconComponent && (
        <IconComponent
          className={cn(
            'shrink-0',
            size === 'sm' ? 'size-3' : 'size-3.5',
            variant === 'info' && 'animate-spin',
          )}
        />
      )}
      <span className='truncate'>{label}</span>
    </div>
  );
}
