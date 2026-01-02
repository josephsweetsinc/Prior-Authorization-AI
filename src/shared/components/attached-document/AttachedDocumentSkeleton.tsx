import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Skeleton } from '../skeleton';

export const AttachedDocumentSkeleton = ({
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  return (
    <article
      className={cn(
        'flex items-center justify-between rounded-xl bg-[rgba(4,124,180,0.05)] p-4',
        className,
      )}
      {...props}
    >
      <div className='space-y-2'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-3 w-20' />
      </div>

      <div className='flex gap-2'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <Skeleton className='h-8 w-8 rounded-full' />
      </div>
    </article>
  );
};
