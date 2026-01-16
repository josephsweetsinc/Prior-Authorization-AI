import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

interface NotificationBadgeProps extends HTMLProps<HTMLSpanElement> {
  count: number;
  max?: number;
  className?: string;
}

export const NotificationBadge = ({
  count,
  max = 99,
  className,
  ...props
}: NotificationBadgeProps) => {
  if (count === 0) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={cn(
        'bg-status-destructive absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold text-white',
        className,
      )}
      {...props}
    >
      {displayCount}
    </span>
  );
};
