import { useGetNotificationsQuery } from '@/services/notifications/';
import { useWebSocket } from '@/services/websocket/api/websocket-service';
import { POLLING_INTERVAL } from '@/services/websocket/constants';

import { unreadCount } from '../utils/filters';

export const useUnreadNotificationsCount = () => {
  const { isConnected } = useWebSocket();

  const { data: allNotificationsData, isLoading } = useGetNotificationsQuery(
    {
      page: 1,
      category: undefined,
    },
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
