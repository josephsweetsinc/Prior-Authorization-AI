import { Skeleton, Window } from '@/shared/components';

export const ProfileHeaderCardSkeleton = () => {
  return (
    <Window className='p-6'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex w-full flex-col gap-6 md:flex-row md:items-center'>
          <Skeleton className='bg-muted h-25 w-25 rounded-full' />

          <div className='w-full space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <Skeleton className='bg-muted h-6 w-48 rounded' />
                <Skeleton className='bg-muted h-4 w-24 rounded' />
              </div>
              <Skeleton className='bg-muted h-8 w-20 rounded' />
            </div>

            <div className='flex flex-wrap justify-between gap-6'>
              <Skeleton className='bg-muted h-4 w-40 rounded' />
              <Skeleton className='bg-muted h-4 w-32 rounded' />
              <Skeleton className='bg-muted h-4 w-44 rounded' />
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};
