import { api as baseApi } from '@/services/api/api';
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetRequestBody,
  PasswordResetResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/services/auth/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => {
        const formData = new URLSearchParams();

        formData.append('grant_type', 'password');
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        return {
          url: '/api/v1/auth/login',
          method: 'POST',
          body: formData.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
    }),

    passwordResetRequest: build.mutation<
      PasswordResetResponse,
      PasswordResetRequestBody
    >({
      query: (body) => ({
        url: '/api/v1/auth/password-reset/request',
        method: 'POST',
        body,
      }),
    }),

    passwordResetVerify: build.mutation<void, { code: string }>({
      query: (body) => ({
        url: '/api/v1/auth/password-reset/verify',
        method: 'POST',
        body,
      }),
    }),

    passwordResetConfirm: build.mutation<
      void,
      { email: string; new_password: string }
    >({
      query: (body) => ({
        url: '/api/v1/auth/password-reset/confirm',
        method: 'POST',
        body,
      }),
    }),

    signup: build.mutation<SignUpResponse, SignUpRequest>({
      query: (body) => ({
        url: '/api/v1/auth/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  usePasswordResetRequestMutation,
  usePasswordResetVerifyMutation,
  usePasswordResetConfirmMutation,
  useSignupMutation,
} = authApi;
