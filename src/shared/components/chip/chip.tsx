'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Check, X, Clock, Loader2, Info } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const chipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-sm font-medium transition-colors ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        success: 'bg-[rgba(36,178,0,0.1)] text-[#24B200] ',
        info: 'bg-[rgba(6,143,228,0.1)] text-[#047CB4]',
        destructive: 'bg-[rgba(252,42,0,0.1)] text-[#FE5C73] ',
        warning: 'bg-[rgba(252,157,0,0.1)] text-[#FC9D00] ',

        default: 'bg-gray-100 text-gray-900',
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
