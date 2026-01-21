export type NotificationCategory =
  | 'all'
  | 'unread'
  | 'status_updates'
  | 'documents'
  | 'requirements';

export interface INotification {
  id: number;
  user_id: number;
  category: NotificationCategory;
  title: string;
  message: string;
  request_id: number;
  is_read: boolean;
  created_at: string;
}

export interface IGetNotificationsResponse {
  items: INotification[];
  page: number;
  total: number;
  showing: number;
  total_pages: number;
}

export interface IGetNotificationsParams {
  page?: number;
  category?: NotificationCategory;
  is_read?: boolean;
}
