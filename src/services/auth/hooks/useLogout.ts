'use client';

import Cookies from 'js-cookie';
import { useCallback } from 'react';

import { getRefreshToken, clearTokens } from '@/services/api/token';
import { useLogoutMutation } from '@/services/auth/api/auth-api-service';

export function useLogout() {
  const [logoutMutation, { isLoading, error }] = useLogoutMutation();

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutMutation({ refresh_token: refreshToken }).unwrap();
      }
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      try {
        clearTokens();
        Cookies.remove('userRole');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      } catch (e) {
        console.error('Error clearing cookies during logout', e);
      }

      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }
  }, [logoutMutation]);

  return {
    logout,
    isLoading,
    error,
  } as const;
}
