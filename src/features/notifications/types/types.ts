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
