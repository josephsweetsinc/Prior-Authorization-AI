import { type icons } from 'lucide-react';

import type { ProviderStats } from '@/services/stats';

export type ProviderSummaryItem = {
  label: string;
  value: number;
  icon: keyof typeof icons;
  color: 'blue' | 'green' | 'orange' | 'red' | 'indigo';
};

export const extractProviderSummary = (
  stats?: ProviderStats,
): ProviderSummaryItem[] => [
  {
    label: 'Total Requests',
    value: stats?.total_requests ?? 0,
    icon: 'HeartPulse',
    color: 'blue',
  },
  {
    label: 'Approved',
    value: stats?.approved ?? 0,
    icon: 'FileText',
    color: 'green',
  },
  {
    label: 'Submitted',
    value: stats?.submitted ?? 0,
    icon: 'ClockFading',
    color: 'indigo',
  },
  {
    label: 'Rejected',
    value: stats?.rejected ?? 0,
    icon: 'CircleX',
    color: 'red',
  },
];
