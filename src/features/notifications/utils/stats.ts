import { type INotification } from '@/services/notifications';

import {
  documentsCount,
  requirementsCount,
  statusUpdatesCount,
  unreadCount,
} from './filters';

export const getNotificationStats = (notifications: INotification[] = []) => {
  const stats = {
    unread: 0,
    status_updates: 0,
    documents: 0,
    requirements: 0,
  };

  if (!notifications || notifications.length === 0) {
    return stats;
  }

  stats.unread = unreadCount(notifications);
  stats.status_updates = statusUpdatesCount(notifications);
  stats.documents = documentsCount(notifications);
  stats.requirements = requirementsCount(notifications);

  return stats;
};
