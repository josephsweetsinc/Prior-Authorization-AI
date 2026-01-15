import { useGetNotificationsQuery } from '@/services/notifications/';
import { POLLING_INTERVAL } from '@/services/websocket/constants';
import { useWebSocket } from '@/services/websocket/hooks';

import { buildNotificationsParams, unreadCount } from '../utils/filters';

export const useUnreadNotificationsCount = () => {
  const { isConnected } = useWebSocket();

  const { data: allNotificationsData, isLoading } = useGetNotificationsQuery(
    buildNotificationsParams(1),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );

  const count = unreadCount(allNotificationsData?.items || []);

  return {
    count,
    isLoading,
  };
};
