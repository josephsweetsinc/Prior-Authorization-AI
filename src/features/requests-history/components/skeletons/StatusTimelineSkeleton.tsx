import { type HTMLProps } from 'react';

import { Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = {
  items?: number;
} & HTMLProps<HTMLDivElement>;

export const StatusTimelineSkeleton = ({
  items = 3,
  className,
  ...props
}: Props) => {
  return (
    <div className={cn('space-y-5', className)} {...props}>
      {Array.from({ length: items }).map((_, index) => {
        const isLast = index === items - 1;

        return (
          <div key={index} className='relative flex gap-5'>
            {!isLast && (
              <div className='absolute top-7.75 left-3 h-2/3 w-px bg-gray-200' />
            )}

            <Skeleton className='h-6 w-6 rounded-full' />

            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-3 w-40' />
              <Skeleton className='h-3 w-64' />
            </div>
          </div>
        );
      })}
    </div>
  );
};
