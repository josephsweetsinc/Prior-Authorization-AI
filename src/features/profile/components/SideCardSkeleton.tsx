'use client';

import { Skeleton, Window } from '@/shared/components';

export const SideCardSkeleton = () => {
  return (
    <Window className='p-5'>
      <div className='space-y-8'>
        <Skeleton className='h-6 w-44' />

        <div className='grid gap-3 sm:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className='flex items-center gap-2.5 rounded-2xl bg-[#FBFBFB] px-5 py-3'
            >
              <Skeleton className='size-8 rounded-full' />

              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-6 w-16' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
