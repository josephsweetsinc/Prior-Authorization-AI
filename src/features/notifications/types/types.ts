import { type PaginationState } from '@tanstack/react-table';

import { type NotificationCategory } from '@/services/notifications';

export interface INotificationFilters {
  category: NotificationCategory;
}

export interface NotificationsPaginationProps {
  pagination: PaginationState;
  onPaginationChange: (_state: PaginationState) => void;
  total: number;
  totalPages: number;
}

export interface INotificationStats {
  unread: number;
  status_updates: number;
  documents: number;
  requirements: number;
}

export interface IFilterTab {
  label: string;
  value: NotificationCategory;
}
