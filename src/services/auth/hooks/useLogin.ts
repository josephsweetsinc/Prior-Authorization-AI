import { useLoginMutation } from '@/services/auth/api/auth-api-service';
import type { LoginRequest, LoginResponse } from '@/services/auth/types';

export function useLogin() {
  const [loginMutation, { isLoading, error, data }] = useLoginMutation();

  const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      return await loginMutation(payload).unwrap();
    } catch (err: unknown) {
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
