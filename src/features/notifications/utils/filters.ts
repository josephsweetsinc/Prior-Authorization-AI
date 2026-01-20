import { type INotification } from '@/services/notifications';

export const unreadCount = (data: INotification[]) => {
  return data.filter((n) => !n.is_read).length || 0;
};

export const statusUpdatesCount = (data: INotification[]) => {
  return data.filter((n) => n.category === 'status_updates').length;
};

export const documentsCount = (data: INotification[]) => {
  return data.filter((n) => n.category === 'documents').length;
};

export const requirementsCount = (data: INotification[]) => {
  return data.filter((n) => n.category === 'requirements').length;
};
