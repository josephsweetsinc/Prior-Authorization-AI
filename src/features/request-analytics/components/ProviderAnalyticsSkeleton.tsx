import { DataTableSkeleton, Skeleton } from '@/shared/components';

export function ProviderAnalyticsSkeleton() {
  return (
    <section className='flex items-stretch gap-5'>
      <article className='shrink grow basis-[288px] space-y-7.25 rounded-lg bg-white p-5'>
        <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
          Requests in progress
        </h2>
        <DataTableSkeleton columnCount={3} />
      </article>
      <article className='shrink grow basis-[288px] space-y-7.25 rounded-lg bg-white p-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-brand-dark text-2xl leading-8 font-bold capitalize'>
            Daily submitted requests
          </h2>
          <Skeleton className='h-4 w-20' />
        </div>

        <Skeleton className='block h-62.5' />
      </article>
    </section>
  );
}
