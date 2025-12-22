import { api as baseApi } from '@/services/api/api';
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetRequestBody,
  PasswordResetResponse,
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
  }),
  overrideExisting: false,
});

export const { useLoginMutation, usePasswordResetRequestMutation } = authApi;
