import { type NotificationItem } from '@/services/notifications';

export const isNotificationItem = (
  value: unknown,
): value is NotificationItem => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as NotificationItem).id === 'number'
  );
};

export const safeNotificationHandler = (
  payload: unknown,
  handleNotification: (_notification: NotificationItem) => void,

  lastNotificationIdRef?: { current: number | null },
) => {
  if (!isNotificationItem(payload)) {
    console.warn('Received invalid notification payload', payload);
    return;
  }

  if (lastNotificationIdRef && payload.id === lastNotificationIdRef.current) {
    return;
  }

  if (lastNotificationIdRef) {
    lastNotificationIdRef.current = payload.id;
  }

  handleNotification(payload);
};
