import { format } from 'date-fns';

import { type IReportStats } from '@/services/reports';

import { type IMetric } from '../types';

export const transformReportStatsToMetrics = (
  stats?: IReportStats,
): IMetric[] => {
  if (!stats) {
    return [];
  }

  return [
    {
      metric: 'Total Requests',
      value: stats.total_requests,
      change: stats.total_requests_change,
    },
    {
      metric: 'Approved Requests',
      value: stats.approved_requests,
      change: stats.approved_requests_change,
    },
    {
      metric: 'Denied Requests',
      value: stats.denied_requests,
      change: stats.denied_requests_change,
    },
    {
      metric: 'Pending Requests',
      value: stats.pending_requests,
      change: stats.pending_requests_change,
    },
  ];
};

export const toExactDate = (value: Date): string => {
  const formatted = format(value, 'yyyy-MM-dd');
  return formatted;
};
