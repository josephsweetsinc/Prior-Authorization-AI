import { Skeleton } from '@/shared/components';

export const RequestsAnalyticsSkeleton = () => {
  return (
    <section className='flex items-stretch gap-5'>
      <article className='flex shrink grow basis-[288px] flex-col justify-between gap-7.25 rounded-lg bg-white p-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
            <Skeleton className='h-8 w-20' />
          </h2>
          <Skeleton className='h-4 w-20' />
        </div>

        <Skeleton className='block h-62.5' />
      </article>
      <article className='flex shrink grow basis-[288px] flex-col justify-between gap-7.25 rounded-lg bg-white p-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
            <Skeleton className='h-8 w-20' />
          </h2>
          <Skeleton className='h-4 w-20' />
        </div>

        <Skeleton className='block h-62.5' />
      </article>
    </section>
  );
};
