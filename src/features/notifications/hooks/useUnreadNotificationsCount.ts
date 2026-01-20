import { useGetNotificationsQuery } from '@/services/notifications/';
import {
  buildNotificationsParams,
  useWebSocket,
  POLLING_INTERVAL,
} from '@/services/websocket';

export const useUnreadNotificationsCount = () => {
  const { isConnected } = useWebSocket();

  const { data: allNotificationsData, isLoading } = useGetNotificationsQuery(
    buildNotificationsParams(1, 'unread'),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );

  const count = allNotificationsData?.items
    ? allNotificationsData?.items.length
    : 0;

  return {
    count,
    isLoading,
  };
};
