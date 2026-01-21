'use client';

import { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  onOutside: () => void,
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (e: MouseEvent) => {
      if (!ref || !ref.current) {
        return;
      }

      if (ref.current.contains(e.target as Node)) {
        return;
      }

      onOutside();
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [enabled, onOutside, ref]);
};
