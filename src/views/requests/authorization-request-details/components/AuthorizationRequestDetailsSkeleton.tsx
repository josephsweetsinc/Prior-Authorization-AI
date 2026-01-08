import { Separator, Skeleton, Window } from '@/shared/components';

const DetailFieldSkeleton = () => (
  <div className='space-y-2'>
    <Skeleton className='h-4 w-24' />
    <Skeleton className='h-12 w-full' />
  </div>
);

export const AuthorizationRequestDetailsSkeleton = () => (
  <main className='space-y-6'>
    <section className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
      <div className='space-y-4'>
        <Skeleton className='h-4 w-36' />
        <div className='space-y-2'>
          <Skeleton className='h-7 w-52' />
          <Skeleton className='h-4 w-72' />
        </div>
      </div>
      <Skeleton className='h-10 w-32 rounded-full' />
    </section>

    <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
      <Window className='space-y-8'>
        <div className='space-y-5'>
          <Skeleton className='h-5 w-44' />
          <div className='grid gap-4 md:grid-cols-2'>
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
          </div>
        </div>

        <Separator className='bg-gray-200' />

        <div className='space-y-5'>
          <Skeleton className='h-5 w-40' />
          <div className='grid gap-4 md:grid-cols-2'>
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
          </div>
        </div>

        <Separator className='bg-gray-200' />

        <div className='space-y-5'>
          <Skeleton className='h-5 w-44' />
          <div className='grid gap-4 md:grid-cols-2'>
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
            <DetailFieldSkeleton />
          </div>
        </div>
      </Window>

      <div className='space-y-5'>
        <div className='space-y-3'>
          <Skeleton className='h-11 w-40 rounded-full' />
          <Skeleton className='h-11 w-40 rounded-full' />
        </div>

        <Window className='space-y-4 p-6'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-24 w-full' />
        </Window>
      </div>
    </section>
  </main>
);
