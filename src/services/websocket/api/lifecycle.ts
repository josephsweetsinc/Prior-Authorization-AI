import ReconnectingWebSocket from 'reconnecting-websocket';
import type { CloseEvent } from 'reconnecting-websocket/dist/events';

import {
  CONNECTION_TIMEOUT,
  MAX_RECONNECTION_DELAY,
  MAX_RETRIES,
  MIN_RECONNECTION_DELAY,
  RECONNECTION_DELAY_GROW_FACTOR,
} from '../constants';

import { setConnectedSingleton } from './connection';
import { handleIncomingEvent, clearAllHandlers } from './handlers';
import { acquireCountSingleton } from './refCount';

let wsSingleton: ReconnectingWebSocket | null = null;
let wsUrlSingleton: string | null = null;

export const ensureWebSocket = (websocketUrl: string) => {
  if (acquireCountSingleton === 0) {
    return;
  }

  if (
    wsSingleton &&
    wsUrlSingleton === websocketUrl &&
    (wsSingleton.readyState === WebSocket.OPEN ||
      wsSingleton.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  wsSingleton?.close();

  wsUrlSingleton = websocketUrl;
  wsSingleton = new ReconnectingWebSocket(websocketUrl, [], {
    connectionTimeout: CONNECTION_TIMEOUT,
    maxRetries: MAX_RETRIES,
    minReconnectionDelay: MIN_RECONNECTION_DELAY,
    maxReconnectionDelay: MAX_RECONNECTION_DELAY,
    reconnectionDelayGrowFactor: RECONNECTION_DELAY_GROW_FACTOR,
  });

  wsSingleton.onopen = () => setConnectedSingleton(true);

  wsSingleton.onmessage = (event: MessageEvent) => {
    if (typeof event.data !== 'string') {
      return;
    }
    try {
      const data = JSON.parse(event.data);
      handleIncomingEvent(data);
    } catch (err) {
      console.error('Failed to parse WS message', err);
    }
  };

  wsSingleton.onerror = () => {
    // intentionally empty; ReconnectingWebSocket handles reconnections
  };

  wsSingleton.onclose = (_event: CloseEvent) => setConnectedSingleton(false);
};

export const sendSingleton = (data: unknown) => {
  if (wsSingleton?.readyState === WebSocket.OPEN) {
    wsSingleton.send(JSON.stringify(data));
  }
};

export const closeSingleton = () => {
  if (acquireCountSingleton > 0) {
    return;
  }

  wsSingleton?.close();
  wsSingleton = null;
  wsUrlSingleton = null;
  clearAllHandlers();
  setConnectedSingleton(false);
};
