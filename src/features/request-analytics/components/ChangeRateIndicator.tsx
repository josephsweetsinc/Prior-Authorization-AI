import { ChevronUp, ChevronDown } from 'lucide-react';
import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

type Props = {
  total: number;
  changeRate: number;
} & HTMLProps<HTMLDivElement>;

export function ChangeIndicator({
  total,
  changeRate,
  className,
  ...props
}: Props) {
  const isPositive = changeRate > 0;
  const isNegative = changeRate < 0;

  const Icon = isPositive ? ChevronUp : isNegative ? ChevronDown : null;

  return (
    <div className={cn('flex items-end gap-3', className)}>
      <p className='text-brand-dark text-xl font-semibold'>{total}</p>
      <div
        className={cn('flex items-center gap-1 text-sm font-medium', {
          'text-status-success': isPositive,
          'text-status-destructive': isNegative,
          'text-status-info': changeRate === 0,
        })}
        {...props}
      >
        {Icon && <Icon className='h-4 w-4' />}
        <p>{Math.abs(changeRate)}%</p>
      </div>
    </div>
  );
}
