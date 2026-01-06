import { api as baseApi } from '@/services/api/api';
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetRequestBody,
  PasswordResetResponse,
  SignUpRequest,
  IUser,
  UpdatePasswordRequest,
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
          url: '/auth/login',
          method: 'POST',
          body: formData.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
      invalidatesTags: ['User'],
    }),

    passwordResetRequest: build.mutation<
      PasswordResetResponse,
      PasswordResetRequestBody
    >({
      query: (body) => ({
        url: '/auth/password-reset/request',
        method: 'POST',
        body,
      }),
    }),

    passwordResetVerify: build.mutation<void, { code: string }>({
      query: (body) => ({
        url: '/auth/password-reset/verify',
        method: 'POST',
        body,
      }),
    }),

    passwordResetConfirm: build.mutation<
      void,
      { email: string; new_password: string }
    >({
      query: (body) => ({
        url: '/auth/password-reset/confirm',
        method: 'POST',
        body,
      }),
    }),

    getCurrentUser: build.query<IUser, void>({
      query: () => '/user/me',
      providesTags: ['User'],
    }),

    signup: build.mutation<IUser, SignUpRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    logout: build.mutation<void, { refresh_token: string }>({
      query: ({ refresh_token }) => ({
        url: '/auth/logout',
        method: 'DELETE',
        params: {
          refresh_token,
        },
      }),
      invalidatesTags: ['User'],
    }),

    updatePassword: build.mutation<void, UpdatePasswordRequest>({
      query: (body) => ({
        url: '/auth/password-change',
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
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdatePasswordMutation,
} = authApi;
