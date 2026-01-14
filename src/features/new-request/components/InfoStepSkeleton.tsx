import { Skeleton } from '@/shared/components';

export const InfoStepSkeleton = () => {
  return (
    <div className='space-y-8'>
      <div className='space-y-3'>
        <Skeleton className='h-7 w-72' />
        <Skeleton className='h-5 w-105' />
        <Skeleton className='mt-8 h-6 w-64' />
      </div>

      <Skeleton className='h-20 w-full rounded-xl' />

      <div className='flex flex-wrap gap-5'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-14 w-full shrink grow basis-1/3 rounded-xl'
          />
        ))}
      </div>

      <Skeleton className='my-5 h-14 w-full rounded-xl' />
      <Skeleton className='h-14 w-full rounded-xl' />

      <div className='flex justify-between pt-4'>
        <Skeleton className='h-12 w-32 rounded-xl' />
        <Skeleton className='h-12 w-32 rounded-xl' />
      </div>
    </div>
  );
};
