export let acquireCountSingleton = 0;

export const incrementAcquireCount = () => {
  acquireCountSingleton += 1;
};

export const decrementAcquireCount = () => {
  acquireCountSingleton = Math.max(0, acquireCountSingleton - 1);
  return acquireCountSingleton;
};
