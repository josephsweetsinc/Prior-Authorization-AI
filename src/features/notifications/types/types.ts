import { type NotificationCategory } from '@/services/notifications';

export interface INotificationFilters {
  category: NotificationCategory;
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
