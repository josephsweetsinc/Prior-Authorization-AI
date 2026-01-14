import { api as baseApi } from '@/services/api/api';

import {
  type IGenerateReportParams,
  type IGenerateReportResponse,
  type ILatestReports,
} from '../types';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentReports: builder.query<ILatestReports, void>({
      query: () => '/report/latest',
      providesTags: ['Reports'],
    }),
    generateReport: builder.mutation<
      IGenerateReportResponse,
      IGenerateReportParams
    >({
      query: (body) => ({
        url: '/report/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reports'],
    }),
  }),
  overrideExisting: false,
});

export const selectRecentReports = (data?: ILatestReports) => data?.reports;
export const selectReportStatistics = (data?: ILatestReports) =>
  data?.current_statistics;

export const { useGenerateReportMutation, useGetRecentReportsQuery } =
  reportsApi;
