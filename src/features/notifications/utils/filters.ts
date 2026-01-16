import { type INotification } from '../types';
import { type NotificationCategory } from '../types/types';

export const filteredNotifications = (
  data: INotification[],
  category: NotificationCategory,
) => {
  return category === 'unread'
    ? data?.filter((n) => !n.is_read) || []
    : data || [];
};

export const unreadCount = (data: INotification[]) => {
  return data?.filter((n) => !n.is_read).length || 0;
};

export const statusUpdatesCount = (data: INotification[]) => {
  return data?.filter((n) => n.category === 'status_updates').length || 0;
};

export const documentsCount = (data: INotification[]) => {
  return data?.filter((n) => n.category === 'documents').length || 0;
};

export const requirementsCount = (data: INotification[]) => {
  return data?.filter((n) => n.category === 'requirements').length || 0;
};
