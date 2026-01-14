import { MetricsCard, Separator, Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

export const MetricsCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <MetricsCard className={cn('space-y-3', className)}>
      <MetricsCard.Group className='flex items-center gap-3'>
        <Skeleton className='box-content size-8 rounded-lg p-3.5' />

        <MetricsCard.Group className='space-y-2'>
          <Skeleton className='h-4 w-32' />

          <Skeleton className='h-7 w-20 md:h-8 xl:h-9' />
        </MetricsCard.Group>
      </MetricsCard.Group>
      <Separator className='bg-gray-separator' />
      <Skeleton className='h-4 w-32' />
    </MetricsCard>
  );
};
