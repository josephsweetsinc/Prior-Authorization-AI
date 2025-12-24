'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { getRefreshToken, clearTokens } from '@/services/api/token';
import { useLogoutMutation } from '@/services/auth/api/auth-api-service';

export function useLogout() {
  const router = useRouter();
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

      router.push('/login');
    }
  }, [logoutMutation, router]);

  return {
    logout,
    isLoading,
    error,
  } as const;
}
