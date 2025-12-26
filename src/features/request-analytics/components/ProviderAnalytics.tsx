'use client';

import { useGetProviderAnalytics } from '@/services/request-analytics';

import { DailySubmittedRequests } from './DailySubmittedRequests';
import { RequestsAnalyticsSkeleton } from './RequestsAnalyticsSkeleton';
import { RequestsInProgress } from './RequestsInProgress';

export const ProviderAnalytics = () => {
  const { analytics, isLoading } = useGetProviderAnalytics();

  if (isLoading) {
    return <RequestsAnalyticsSkeleton />;
  }

  return (
    <section className='flex flex-wrap items-stretch gap-5'>
      <RequestsInProgress
        data={analytics.requestsInProgress.slice(0, 4)}
        className='shrink grow basis-[288px]'
      />
      <DailySubmittedRequests
        data={analytics.dailySubmittedRequests}
        className='shrink grow basis-[288px]'
      />
    </section>
  );
};
