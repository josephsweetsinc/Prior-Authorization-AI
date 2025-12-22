import { useLoginMutation } from '@/services/auth/api/auth-api-service';
import type { LoginRequest, LoginResponse } from '@/services/auth/types';

export function useLogin() {
  const [loginMutation, { isLoading, error, data }] = useLoginMutation();

  const login = async (payload: LoginRequest) => {
    try {
      const response = await loginMutation(payload).unwrap();
      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    login,
    isLoading,
    error,
    data,
  };
}
