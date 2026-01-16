import { useMarkNotificationAsReadMutation } from '@/services/notifications/api/notifications-api';

export const useMarkNotificationAsRead = () => {
  const [markAsRead] = useMarkNotificationAsReadMutation();

  return (notificationId: number) => {
    markAsRead(notificationId);
  };
};
