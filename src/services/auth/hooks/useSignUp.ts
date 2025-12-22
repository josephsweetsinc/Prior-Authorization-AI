import { useSignupMutation } from '@/services/auth/api/auth-api-service';
import type { SignUpRequest, SignUpResponse } from '@/services/auth/types';

export function useSignUp() {
  const [signupMutation, { isLoading, error, data }] = useSignupMutation();

  const signup = async (payload: SignUpRequest): Promise<SignUpResponse> => {
    try {
      return await signupMutation(payload).unwrap();
    } catch (err: unknown) {
      throw err;
    }
  };

  return {
    signup,
    isLoading,
    error,
    data,
  };
}
