'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import {
  Sparkles,
  Info,
  CircleCheck,
  ClockFading,
  AlertCircle,
  CircleX,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const messageVariants = cva(
  'relative w-full rounded-xl flex items-start gap-3 transition-all ',
  {
    variants: {
      variant: {
        ai: 'bg-status-info/10 text-status-info [&>svg]:text-current',
        info: 'bg-status-info/10 text-status-info [&>svg]:text-current',
        incomplete:
          'bg-status-warning/10 text-status-warning [&>svg]:text-current',
        missing:
          'bg-status-destructive/10 text-status-destructive [&>svg]:text-current',
        success:
          'bg-status-success/10 text-status-success [&>svg]:text-current',
        complete:
          'bg-status-success/10 text-status-success [&>svg]:text-current',
        destructive:
          'bg-status-destructive/10 text-status-destructive [&>svg]:text-current',
      },
      size: {
        default: 'px-3 py-2.5 text-sm [&_svg]:size-5',
        sm: 'p-3 text-xs [&_svg]:size-4',
        lg: 'p-6 text-base [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'ai',
      size: 'default',
    },
  },
);

const icons = {
  ai: Sparkles,
  info: Info,
  incomplete: ClockFading,
  success: CircleCheck,
  complete: CircleCheck,
  destructive: AlertCircle,
  missing: CircleX,
};

export interface SensitiveMessageProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  title?: string;
  description?: string;
  withIcon?: boolean;
}

export function SensitiveMessage({
  className,
  variant = 'ai',
  size,
  title,
  description,
  children,
  withIcon = true,
  ...props
}: SensitiveMessageProps) {
  const IconComponent = icons[variant || 'ai'];

  return (
    <div
      className={cn(messageVariants({ variant, size }), className)}
      {...props}
    >
      <div className='flex min-w-0 flex-col gap-2'>
        <div className='flex items-center gap-2'>
          {withIcon && IconComponent && (
            <IconComponent className='mt-0.5 shrink-0' />
          )}
          {title && (
            <h5 className='leading-relaxed font-semibold tracking-tight'>
              {title}
            </h5>
          )}
        </div>
        <div className='leading-relaxed opacity-90'>
          {description || children}
        </div>
      </div>
    </div>
  );
}
