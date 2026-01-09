'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { type HTMLProps } from 'react';

import { useGetRequestsByStatus } from '@/services/request-totals';
import { OverlayIcon, Separator } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import MetricsCard from './MetricsCard';
import { MetricsListSkeleton } from './skeletons/MetricsListSkeleton';

type Props = HTMLProps<HTMLElement>;

export const AdminMetrics = ({ className, ...props }: Props) => {
  const { kpi, isLoading } = useGetRequestsByStatus();

  if (isLoading) {
    return <MetricsListSkeleton className={className} />;
  }

  return (
    <section className={cn('flex items-stretch gap-5', className)} {...props}>
      <MetricsCard className='shrink grow basis-[288px] items-center space-y-3'>
        <MetricsCard.Group className='flex gap-3'>
          <OverlayIcon variant='FileChartColumnIncreasing' color='blue' />
          <MetricsCard.Group>
            <MetricsCard.Label>Approved Requests</MetricsCard.Label>
            <MetricsCard.Value>{kpi.approved_requests}</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard.Group>

        <Separator className='bg-gray-200' />
        <MetricsCard.Description
          className={cn('flex items-center gap-2', {
            'text-status-success': kpi.approved_requests_change_percent > 0,
            'text-status-destructive': kpi.approved_requests_change_percent < 0,
            'text-status-info': kpi.approved_requests_change_percent === 0,
          })}
        >
          {kpi.approved_requests_change_percent > 0 ? (
            <TrendingUp className='size-5' />
          ) : (
            <TrendingDown className='size-5' />
          )}
          <span>{kpi.approved_requests_change_percent}% from last month</span>
        </MetricsCard.Description>
      </MetricsCard>
      <MetricsCard className='shrink grow basis-[288px] items-center space-y-3'>
        <MetricsCard.Group className='flex gap-3'>
          <OverlayIcon variant='ClockFading' color='indigo' />
          <MetricsCard.Group>
            <MetricsCard.Label>Submitted Requests</MetricsCard.Label>
            <MetricsCard.Value>{kpi.pending_review}</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard.Group>
        <Separator className='bg-gray-200' />
        <MetricsCard.Description>
          Avg. wait time: {kpi.pending_avg_wait_time_hours} hours
        </MetricsCard.Description>
      </MetricsCard>
      <MetricsCard className='shrink grow basis-[288px] items-center space-y-3'>
        <MetricsCard.Group className='flex gap-3'>
          <OverlayIcon variant='CircleX' color='red' />
          <MetricsCard.Group>
            <MetricsCard.Label>Rejected Requests</MetricsCard.Label>
            <MetricsCard.Value>{kpi.denied_requests}</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard.Group>
        <Separator className='bg-gray-200' />
        <MetricsCard.Description>
          {kpi.denial_rate_percent}% denial rate
        </MetricsCard.Description>
      </MetricsCard>
      <MetricsCard className='shrink grow basis-[288px] items-center space-y-3'>
        <MetricsCard.Group className='flex gap-3'>
          <OverlayIcon variant='BrainCircuit' color='blue' />
          <MetricsCard.Group>
            <MetricsCard.Label>AI Form Accuracy</MetricsCard.Label>
            <MetricsCard.Value>{kpi.ai_accuracy}%</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard.Group>
        <Separator className='bg-gray-200' />
        <MetricsCard.Description>
          AI-powered auto-fill accuracy rate
        </MetricsCard.Description>
      </MetricsCard>
    </section>
  );
};
