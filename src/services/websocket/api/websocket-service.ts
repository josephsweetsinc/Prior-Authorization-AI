'use client';

import ReconnectingWebSocket from 'reconnecting-websocket';
import type { CloseEvent } from 'reconnecting-websocket/dist/events';

import {
  CONNECTION_TIMEOUT,
  MAX_RECONNECTION_DELAY,
  MAX_RETRIES,
  MIN_RECONNECTION_DELAY,
  RECONNECTION_DELAY_GROW_FACTOR,
} from '../constants';
import { type NotificationEventHandler } from '../types';

let wsSingleton: ReconnectingWebSocket | null = null;
let wsUrlSingleton: string | null = null;
let isConnectedSingleton = false;
export let acquireCountSingleton = 0;
const eventHandlersSingleton = new Map<string, Set<NotificationEventHandler>>();
const connectionSubscribers = new Set<(_isConnected: boolean) => void>();

const notifyConnectionSubscribers = () => {
  connectionSubscribers.forEach((subscriber) => {
    subscriber(isConnectedSingleton);
  });
};

const setConnectedSingleton = (next: boolean) => {
  if (isConnectedSingleton === next) {
    return;
  }
  isConnectedSingleton = next;
  notifyConnectionSubscribers();
};

export const getIsConnectedSingleton = () => isConnectedSingleton;

export const ensureWebSocket = (websocketUrl: string) => {
  const existing = wsSingleton;
  const existingState = existing?.readyState;
  const urlUnchanged = wsUrlSingleton === websocketUrl;

  if (
    existing &&
    urlUnchanged &&
    (existingState === WebSocket.OPEN || existingState === WebSocket.CONNECTING)
  ) {
    return;
  }

  if (existing) {
    try {
      existing.close();
    } catch (err) {
      console.error('Failed to close existing WebSocket connection', err);
    }
  }

  wsUrlSingleton = websocketUrl;
  wsSingleton = new ReconnectingWebSocket(websocketUrl, [], {
    maxReconnectionDelay: MAX_RECONNECTION_DELAY,
    minReconnectionDelay: MIN_RECONNECTION_DELAY,
    reconnectionDelayGrowFactor: RECONNECTION_DELAY_GROW_FACTOR,
    connectionTimeout: CONNECTION_TIMEOUT,
    maxRetries: MAX_RETRIES,
  });

  wsSingleton.addEventListener('open', () => {
    setConnectedSingleton(true);
  });

  wsSingleton.addEventListener('message', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const eventType = data?.type || 'notification';
      const handlers = eventHandlersSingleton.get(eventType);
      if (handlers) {
        handlers.forEach((handler) => handler(data));
      }
    } catch (err) {
      console.error('Failed to parse WebSocket message', err);
    }
  });

  wsSingleton.addEventListener('error', () => {
    setConnectedSingleton(false);
  });

  wsSingleton.addEventListener('close', (_event: CloseEvent) => {
    setConnectedSingleton(false);
  });
};

export const subscribeConnection = (
  subscriber: (_isConnected: boolean) => void,
) => {
  connectionSubscribers.add(subscriber);
  subscriber(isConnectedSingleton);
  return () => {
    connectionSubscribers.delete(subscriber);
  };
};

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

export const sendSingleton = (data: unknown) => {
  if (wsSingleton?.readyState === WebSocket.OPEN) {
    wsSingleton.send(JSON.stringify(data));
  }
};

export const closeSingleton = () => {
  if (wsSingleton) {
    try {
      wsSingleton.close();
    } catch (err) {
      console.error('Failed to close WebSocket connection', err);
    }
  }
  wsSingleton = null;
  wsUrlSingleton = null;
  eventHandlersSingleton.clear();
  setConnectedSingleton(false);
};

export const incrementAcquireCount = () => {
  acquireCountSingleton += 1;
};

export const decrementAcquireCount = () => {
  acquireCountSingleton = Math.max(0, acquireCountSingleton - 1);
  return acquireCountSingleton;
};
