'use client';

import { useCallback, useState } from 'react';

import { useLogout } from '@/services/auth/hooks/useLogout';

export const useLogoutModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoading } = useLogout();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const confirm = useCallback(() => {
    if (!isLoading) {
      logout();
    }
  }, [isLoading, logout]);

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
  };
};
