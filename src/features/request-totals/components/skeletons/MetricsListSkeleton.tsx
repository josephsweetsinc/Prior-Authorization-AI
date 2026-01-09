import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { MetricsCardSkeleton } from './MetricsCardSkeleton';

export const MetricsListSkeleton = ({
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  return (
    <section
      className={cn('grid grid-cols-2 gap-5 xl:grid-cols-4', className)}
      {...props}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <MetricsCardSkeleton key={i} />
      ))}
    </section>
  );
};
