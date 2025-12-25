import { Plus } from 'lucide-react';
import Link from 'next/link';

import { RecentRequests } from '@/features/recent-requests';
import { MetricsList } from '@/features/request-totals';
import { TitleAndDesc, buttonVariants } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

export const Dashboard = () => {
  return (
    <main className='space-y-5'>
      <div className='flex flex-wrap items-center justify-between gap-6'>
        <TitleAndDesc
          title='Main Dashboard'
          subtitle='Welcome back, manage your authorization requests'
        />

        <Link
          className={cn(
            buttonVariants({ variant: 'primary' }),
            'aspect-square w-max p-3 text-base font-medium capitalize xl:aspect-auto xl:px-10! xl:py-3!',
          )}
          href='/new-request'
        >
          <Plus className='size-4' />
          <span className='sr-only xl:not-sr-only'>New request</span>
        </Link>
      </div>
      <MetricsList />
      <RecentRequests />
    </main>
  );
};
