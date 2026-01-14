export type NotificationEventHandler = (_notification: unknown) => void;

export interface UseWebSocketReturn {
  connect: (_websocketUrl: string, _token: string) => void;
  disconnect: () => void;
  on: (_eventType: string, _handler: NotificationEventHandler) => () => void;
  send: (_data: unknown) => void;
  isConnected: boolean;
}
