'use client';

import { type HTMLProps } from 'react';

import { useGetRequestsSummary } from '@/services/request-totals';
import { OverlayIcon } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import MetricsCard from './MetricsCard';
import { MetricsListSkeleton } from './skeletons/MetricsListSkeleton';

type Props = HTMLProps<HTMLElement>;

export const ProviderMetrics = ({ className, ...props }: Props) => {
  const { summary, isLoading } = useGetRequestsSummary();

  if (isLoading) {
    return <MetricsListSkeleton className={className} />;
  }

  return (
    <section
      className={cn('flex flex-wrap items-center gap-5', className)}
      {...props}
    >
      <MetricsCard className='flex shrink grow basis-[288px] items-center gap-4'>
        <OverlayIcon variant='FileChartColumnIncreasing' color='blue' />
        <MetricsCard.Group>
          <MetricsCard.Label>Total Requests</MetricsCard.Label>
          <MetricsCard.Value>{summary.total_requests}</MetricsCard.Value>
        </MetricsCard.Group>
      </MetricsCard>
      <MetricsCard className='flex shrink grow basis-[288px] items-center gap-4'>
        <OverlayIcon variant='ClockFading' color='orange' />
        <MetricsCard.Group>
          <MetricsCard.Label>Pending Review</MetricsCard.Label>
          <MetricsCard.Value>{summary.pending_review}</MetricsCard.Value>
        </MetricsCard.Group>
      </MetricsCard>
      <MetricsCard className='flex shrink grow basis-[288px] items-center gap-4'>
        <OverlayIcon variant='HeartPulse' color='green' />
        <MetricsCard.Group>
          <MetricsCard.Label>Approved</MetricsCard.Label>
          <MetricsCard.Value>{summary.approved}</MetricsCard.Value>
        </MetricsCard.Group>
      </MetricsCard>
      <MetricsCard className='flex shrink grow basis-[288px] items-center gap-4'>
        <OverlayIcon variant='ChartNoAxesCombined' color='indigo' />
        <MetricsCard.Group>
          <MetricsCard.Label>Approval rate</MetricsCard.Label>
          <MetricsCard.Value>{summary.approval_rate}</MetricsCard.Value>
        </MetricsCard.Group>
      </MetricsCard>
    </section>
  );
};
