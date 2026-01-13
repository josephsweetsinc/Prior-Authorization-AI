'use client';

import { Skeleton, Window } from '@/shared/components';

export const AccountDetailsCardSkeleton = () => {
  return (
    <Window className='p-5'>
      <div className='space-y-6'>
        <Skeleton className='h-6 w-48' />

        <div className='divide-y divide-neutral-100'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0'
            >
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-28' />
              </div>

              <Skeleton className='h-4 w-40' />
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
