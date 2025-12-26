import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { MetricsCardSkeleton } from './MetricsCardSkeleton';

export const MetricsListSkeleton = ({
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  return (
    <section
      className={cn('flex flex-wrap items-center gap-5', className)}
      {...props}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <MetricsCardSkeleton key={i} />
      ))}
    </section>
  );
};
