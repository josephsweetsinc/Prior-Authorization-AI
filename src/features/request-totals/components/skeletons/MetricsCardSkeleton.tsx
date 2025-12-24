import { Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import MetricsCard from '../MetricsCard';

export const MetricsCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <MetricsCard
      className={cn('flex shrink grow basis-63 items-center gap-4', className)}
    >
      <Skeleton className='box-content size-8 rounded-lg p-3.5' />

      <MetricsCard.Group className='space-y-2'>
        <Skeleton className='h-4 w-32' />

        <Skeleton className='h-7 w-20 md:h-8 xl:h-9' />
      </MetricsCard.Group>
    </MetricsCard>
  );
};
