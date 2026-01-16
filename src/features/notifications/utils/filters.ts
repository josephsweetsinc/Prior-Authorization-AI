import { type INotification } from '../types';
import {
  type NotificationCategory,
  type CategoryCountsProps,
} from '../types/types';

export const filteredNotifications = (
  data: INotification[],
  category: NotificationCategory,
) => {
  if (!data) {
    return [];
  }

  switch (category) {
    case 'unread':
      return data.filter((n) => !n.is_read);
    case 'status_updates':
      return data.filter((n) => n.category === 'status_updates');
    case 'documents':
      return data.filter((n) => n.category === 'documents');
    case 'requirements':
      return data.filter((n) => n.category === 'requirements');
    default:
      return data;
  }
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

export const getFilteredTotal = ({
  category,
  unreadCount,
  statusUpdatesCount,
  documentsCount,
  requirementsCount,
  backendTotal,
}: CategoryCountsProps): number => {
  switch (category) {
    case 'unread':
      return unreadCount;
    case 'status_updates':
      return statusUpdatesCount;
    case 'documents':
      return documentsCount;
    case 'requirements':
      return requirementsCount;
    default:
      return backendTotal;
  }
};
