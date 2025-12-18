'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Sparkles, Info, CircleCheck, AlertCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const messageVariants = cva(
  'relative w-full rounded-xl flex items-start gap-3 transition-all ',
  {
    variants: {
      variant: {
        ai: 'bg-[rgba(6,143,228,0.1)] text-[#047CB4] [&>svg]:text-[#047CB4]',
        info: 'bg-[rgba(6,143,228,0.1)] text-[#047CB4] [&>svg]:text-[#047CB4]',
        success:
          'bg-[rgba(36,178,0,0.1)] text-[#24B200]  [&>svg]:text-[#24B200]',
        destructive: 'bg-red-50 text-red-900  [&>svg]:text-red-600',
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
  success: CircleCheck,
  destructive: AlertCircle,
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
          {withIcon && <IconComponent className='mt-0.5 shrink-0' />}
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
