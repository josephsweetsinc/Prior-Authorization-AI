import { cva, type VariantProps } from 'class-variance-authority';
import { TriangleAlert, Info, XCircle } from 'lucide-react';
import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

const variants = cva(
  'flex aspect-3/1 flex-col items-center justify-center gap-2 rounded-lg p-5',
  {
    variants: {
      variant: {
        info: 'bg-status-info/10 text-status-info',
        warning: 'bg-status-warning/10 text-status-warning',
        error: 'bg-status-destructive/10 text-status-destructive',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const ICON_MAP = {
  info: Info,
  warning: TriangleAlert,
  error: XCircle,
};

type Props = {
  message?: string;
} & VariantProps<typeof variants> &
  HTMLProps<HTMLElement>;

export const EmptyStateMessage = ({
  variant,
  message = 'No data found',
  className,
  ...props
}: Props) => {
  const Icon = ICON_MAP[variant ?? 'info'];

  return (
    <article className={cn(variants({ variant }), className)} {...props}>
      <Icon className='size-6' />
      <p className='text-base font-semibold capitalize'>{message}</p>
    </article>
  );
};
