import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Auth', 'User', 'Dashboard'],
  endpoints: () => ({}),
});
