import { type RequestStatus } from '@/services/dashboard';

import { type IFilters } from './types';

export const DAY_MS = 24 * 60 * 60 * 1000;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
];
export const TIMELINE_STATUS_TITLE = {
  draft: 'Request created',
  submitted: 'Request submitted',
  pending: 'Under review',
  approved: 'Request approved',
  denied: 'Request denied',
};

export const STATUS_TO_TIMELINE_STATUS: Record<RequestStatus, RequestStatus> = {
  approved: 'approved',
  pending: 'pending',
  draft: 'pending',
  submitted: 'submitted',
  denied: 'denied',
};

export const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: '7-days', label: 'Last 7 Days' },
  { value: '30-days', label: 'Last 30 Days' },
  { value: '90-days', label: 'Last 90 Days' },
  { value: 'year', label: 'This Year' },
];

export const DEFAULT_FILTERS: IFilters = {
  searchQuery: '',
  status: 'all',
  date: 'all',
};

export const DEFAULT_PAGE_SIZE = 8;
