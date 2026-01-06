import { type IFilters } from './types';

export const DAY_MS = 24 * 60 * 60 * 1000;

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
];

export const DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '0', label: 'Today' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '365', label: 'This Year' },
];

export const DEFAULT_FILTERS: IFilters = {
  searchQuery: '',
  status: 'all',
  date: 'all',
};

export const DEFAULT_PAGE_SIZE = 8;
