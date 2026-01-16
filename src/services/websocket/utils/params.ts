import { type NotificationCategory } from '@/features/notifications';
import { type NotificationsParams } from '@/services/notifications';
import { clearParams } from '@/shared/lib/utils';

export const apiCategory = (category: NotificationCategory) => {
  return category === 'unread' || category === 'all' ? undefined : category;
};

export const buildNotificationsParams = (
  page: number,
  category?: NotificationCategory,
): NotificationsParams => {
  return clearParams({
    page,
    category: category ? apiCategory(category) : undefined,
    filter: category === 'all' || category === 'unread' ? category : undefined,
  });
};
