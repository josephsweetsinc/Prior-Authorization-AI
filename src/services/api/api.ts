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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

const authPaths = ['/auth/login', '/auth/refresh', '/auth/signup'];

const withAuthHeader = (args: string | FetchArgs, token: string): FetchArgs => {
  if (typeof args === 'string') {
    return {
      url: args,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return {
    ...args,
    headers: {
      ...(args.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
};

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  const skipAuth = authPaths.some((path) => url.includes(path));

  let requestArgs = args;

  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestArgs = withAuthHeader(args, accessToken);
    }
  }

  const result = await rawBaseQuery(requestArgs, api, extraOptions);

  if (result.error?.status !== 401 || skipAuth) {
    return result;
  }

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

        const refreshResult = await rawBaseQuery(
          {
            url: `/auth/refresh?refresh_token=${refreshToken}`,
            method: 'POST',
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          setTokens(
            refreshResult.data as {
              access_token: string;
              refresh_token?: string;
            },
          );
          return true;
        }

        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }

        return false;
      })();
    }

    const refreshed = await refreshPromise;
    refreshPromise = null;

    if (!refreshed) {
      return result;
    }

    const newAccessToken = getAccessToken();
    if (!newAccessToken) {
      return result;
    }

    const retryArgs = withAuthHeader(args, newAccessToken);
    return await rawBaseQuery(retryArgs, api, extraOptions);
  } catch {
    refreshPromise = null;
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
    return result;
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Dashboard', 'RequestsHistory'],
  endpoints: () => ({}),
});
