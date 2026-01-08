import type { ProviderStats } from '@/services/stats';

export type ProviderSummaryItem = {
  label: string;
  value: number;
  icon: 'FileText' | 'HeartPulse' | 'ClockFading' | 'Shuffle';
  color: 'blue' | 'green' | 'orange' | 'red';
};

export const extractProviderSummary = (
  stats?: ProviderStats,
): ProviderSummaryItem[] => [
  {
    label: 'Submitted',
    value: stats?.submitted ?? 0,
    icon: 'FileText',
    color: 'blue',
  },
  {
    label: 'Approved',
    value: stats?.approved ?? 0,
    icon: 'HeartPulse',
    color: 'green',
  },
  {
    label: 'Total Requests',
    value: stats?.total_requests ?? 0,
    icon: 'ClockFading',
    color: 'orange',
  },
  {
    label: 'Rejected',
    value: stats?.rejected ?? 0,
    icon: 'Shuffle',
    color: 'red',
  },
];
