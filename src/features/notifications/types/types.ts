import { type PaginationState } from '@tanstack/react-table';
import { type HTMLAttributes } from 'react';

export type NotificationCategory =
  | 'all'
  | 'unread'
  | 'status_updates'
  | 'documents'
  | 'requirements';

export interface INotificationFilters {
  category: NotificationCategory;
}

export interface INotification {
  id: number;
  user_id: number;
  category: string;
  title: string;
  message: string;
  request_id: number;
  is_read: boolean;
  created_at: string;
}

export interface FilterTabsProps {
  activeCategory: NotificationCategory;
  onCategoryChange: (_category: NotificationCategory) => void;
  categoryCounts?: {
    unread: number;
    status_updates: number;
    documents: number;
    requirements: number;
  };
}

export interface NotificationsFeedProps {
  notifications: INotification[];
  isLoading?: boolean;
  onNotificationClick?: (_notificationId: number) => void;
}

export interface NotificationFeedItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onClick'
> {
  notification: INotification;
  onClick?: (_id: number) => void;
  isAdmin?: boolean;
}

export interface NotificationsPaginationProps {
  pagination: PaginationState;
  onPaginationChange: (_state: PaginationState) => void;
  total: number;
  totalPages: number;
}

export interface UseNotificationsPaginationProps {
  pagination: PaginationState;
  onPaginationChange: (_pagination: PaginationState) => void;
  total: number;
  totalPages: number;
}
