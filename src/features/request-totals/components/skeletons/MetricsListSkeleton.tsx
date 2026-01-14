import { type HTMLProps } from 'react';

import { MetricsCardSkeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

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
