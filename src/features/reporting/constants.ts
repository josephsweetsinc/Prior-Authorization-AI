import { type ReportFormat, type IMetric, type IRecentReport } from './types';

export const MOCK_METRICS: IMetric[] = [
  {
    metric: 'Total Requests',
    value: '1,284',
    change: 12.5,
  },
  {
    metric: 'Approved Requests',
    value: '942',
    change: 8.2,
  },
  {
    metric: 'Denied Requests',
    value: '176',
    change: -3.4,
  },
  {
    metric: 'Pending Requests',
    value: '166',
    change: 0,
  },
  {
    metric: 'Active Users',
    value: '328',
    change: 5.9,
  },
];

export const MOCK_RECENT_REPORTS: IRecentReport[] = [
  {
    name: 'Monthly Authorization Summary',
    generatedBy: 'Admin User',
    format: 'pdf',
    date: '2025-01-05T10:42:00Z',
    link: '/reports/monthly-authorization-summary.pdf',
  },
  {
    name: 'Denied Requests Report',
    generatedBy: 'System',
    format: 'csv',
    date: '2025-01-04T16:18:00Z',
    link: '/reports/denied-requests.csv',
  },
  {
    name: 'Pending Requests Overview',
    generatedBy: 'Jane Smith',
    format: 'xlsx',
    date: '2025-01-03T09:30:00Z',
    link: '/reports/pending-requests.xlsx',
  },
  {
    name: 'User Activity Log',
    generatedBy: 'Admin User',
    format: 'pdf',
    date: '2025-01-02T14:05:00Z',
    link: '/reports/user-activity-log.pdf',
  },
  {
    name: 'Transportation Type Breakdown',
    generatedBy: 'System',
    format: 'csv',
    date: '2025-01-01T11:50:00Z',
    link: '/reports/transportation-type-breakdown.csv',
  },
];

export const MOCK_FORMAT_OPTIONS: { label: string; value: ReportFormat }[] = [
  { label: 'Excel', value: 'xlsx' },
  { label: 'CSV', value: 'csv' },
  { label: 'PDF', value: 'pdf' },
];

export const MOCK_DATE_RANGE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Last week', value: 'week' },
  { label: 'Last month', value: 'month' },
  { label: 'Last year', value: 'year' },
];
