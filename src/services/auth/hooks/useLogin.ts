import Cookies from 'js-cookie';

import { useLoginMutation } from '@/services/auth/api/auth-api-service';
import type { LoginRequest, LoginResponse } from '@/services/auth/types';

export function useLogin() {
  const [loginMutation, { isLoading, error, data }] = useLoginMutation();

  const login = async (
    payload: LoginRequest,
    keepLoggedIn: boolean = false,
  ): Promise<LoginResponse> => {
    try {
      const response = await loginMutation(payload).unwrap();

      const expires = keepLoggedIn ? 30 : 1;

      Cookies.set('accessToken', response.access_token, {
        expires,
        secure: true,
        sameSite: 'strict',
      });

      Cookies.set('userRole', String(response.user_role), {
        expires,
        secure: true,
        sameSite: 'strict',
      });

      if (response.refresh_token) {
        Cookies.set('refreshToken', response.refresh_token, {
          expires: 7,
          secure: true,
          sameSite: 'strict',
        });
      }

      return response;
    } catch (err) {
      throw err;
    }
  };

  return { login, isLoading, error, data };
}
