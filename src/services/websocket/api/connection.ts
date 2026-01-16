let isConnectedSingleton = false;
const connectionSubscribers = new Set<(_isConnected: boolean) => void>();

export const getIsConnectedSingleton = () => isConnectedSingleton;

export const setConnectedSingleton = (next: boolean) => {
  if (isConnectedSingleton === next) {
    return;
  }
  isConnectedSingleton = next;
  connectionSubscribers.forEach((cb) => cb(isConnectedSingleton));
};

export const subscribeConnection = (
  subscriber: (_isConnected: boolean) => void,
) => {
  connectionSubscribers.add(subscriber);
  subscriber(isConnectedSingleton);
  return () => connectionSubscribers.delete(subscriber);
};
