import { type INotificationFilters } from './types/types';

export const DEFAULT_FILTERS: INotificationFilters = {
  category: 'all',
};

export const DEFAULT_PAGE_SIZE = 8;

export const FILTER_TABS = [
  { value: 'all' as const, label: 'All' },
  { value: 'unread' as const, label: 'Unread' },
  { value: 'status_updates' as const, label: 'Status Updates' },
  { value: 'documents' as const, label: 'Documents' },
  { value: 'requirements' as const, label: 'Requirements' },
];
