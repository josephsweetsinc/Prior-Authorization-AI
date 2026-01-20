import { Skeleton } from '@/shared/components';

export const NotificationFeedSkeleton = () => {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='rounded-xl border bg-white p-5'>
          <div className='flex items-end justify-between gap-6'>
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-5 w-1/3' />
              <Skeleton className='h-4 w-full' />
            </div>
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
      ))}
    </div>
  );
};
