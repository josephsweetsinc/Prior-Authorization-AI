export type NotificationCategory =
  | 'all'
  | 'unread'
  | 'status_updates'
  | 'documents'
  | 'requirements';

export type NotificationItem = {
  id: number;
  user_id: number;
  category: string;
  title: string;
  message: string;
  request_id: number;
  is_read: boolean;
  created_at: string;
};

export type NotificationsResponse = {
  items: NotificationItem[];
  page: number;
  total: number;
  showing: number;
  total_pages: number;
};

export type NotificationsParams = {
  page?: number;
  category?: NotificationCategory;
};
