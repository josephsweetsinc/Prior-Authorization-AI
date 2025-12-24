import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './token';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;

  const authPaths = ['/auth/login', '/auth/refresh', '/auth/signup'];
  const skipAuth = authPaths.some((path) => url.includes(path));

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      if (typeof args === 'string') {
        args = {
          url: args,
          headers: { Authorization: `Bearer ${token}` },
        };
      } else {
        args = {
          ...args,
          headers: {
            ...(args.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        };
      }
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !skipAuth) {
    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            clearTokens();
            if (typeof window !== 'undefined') {
              window.location.replace('/login');
            }
            return false;
          }

          const refreshRes = await baseQuery(
            {
              url: '/auth/refresh',
              method: 'POST',
              body: { refresh_token: refreshToken },
            },
            api,
            extraOptions,
          );

          if (refreshRes.data) {
            setTokens(
              refreshRes.data as {
                access_token: string;
                refresh_token?: string;
              },
            );
            return true;
          }

          if (
            refreshRes.error &&
            (refreshRes.error.status === 401 || refreshRes.error.status === 403)
          ) {
            clearTokens();
            if (typeof window !== 'undefined') {
              window.location.replace('/login');
            }
          }

          return false;
        })();
      }

      const ok = await refreshPromise;
      refreshPromise = null;

      if (ok) {
        const token2 = getAccessToken();
        if (token2) {
          if (typeof args === 'string') {
            args = {
              url: args,
              headers: { Authorization: `Bearer ${token2}` },
            };
          } else {
            args = {
              ...args,
              headers: {
                ...(args.headers || {}),
                Authorization: `Bearer ${token2}`,
              },
            };
          }
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login')
        ) {
        }
      }
    } catch {
      refreshPromise = null;
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Dashboard'],
  endpoints: () => ({}),
});
