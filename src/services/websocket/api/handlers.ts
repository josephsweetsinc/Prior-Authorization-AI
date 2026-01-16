import type { NotificationEventHandler, WebSocketEvent } from '../types';

const eventHandlersSingleton = new Map<string, Set<NotificationEventHandler>>();

export const onSingleton = (
  eventType: string,
  handler: NotificationEventHandler,
) => {
  if (!eventHandlersSingleton.has(eventType)) {
    eventHandlersSingleton.set(eventType, new Set());
  }
  eventHandlersSingleton.get(eventType)!.add(handler);

  return () => {
    const handlers = eventHandlersSingleton.get(eventType);
    if (!handlers) {
      return;
    }
    handlers.delete(handler);
    if (handlers.size === 0) {
      eventHandlersSingleton.delete(eventType);
    }
  };
};

export const handleIncomingEvent = (data: WebSocketEvent) => {
  const type = data.type ?? 'notification';

  const handlers = eventHandlersSingleton.get(type);
  if (!handlers) {
    return;
  }

  handlers.forEach((handler: NotificationEventHandler) => handler(data));
};

export const clearAllHandlers = () => eventHandlersSingleton.clear();
