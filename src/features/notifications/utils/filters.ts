import { type NotificationsParams } from '@/services/notifications/types';

import { type INotification } from '../types';
import { type NotificationCategory } from '../types/types';

export const apiCategory = (category: NotificationCategory) => {
  return category === 'unread' || category === 'all' ? undefined : category;
};

export const buildNotificationsParams = (
  page: number,
  category?: NotificationCategory,
): NotificationsParams => {
  const apiCategoryValue = category ? apiCategory(category) : undefined;

  return apiCategoryValue ? { page, category: apiCategoryValue } : { page };
};

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
