import { type HTMLProps } from 'react';

import { Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

export const DataBlockSkeleton = ({
  className,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-5 w-40' />
    </div>
  );
};
