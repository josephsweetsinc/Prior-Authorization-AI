'use client';

import { useGetCurrentUserQuery } from '@/services/auth';
import { useGetRecentRequests } from '@/services/recent-requests';
import {
  DataTable,
  DataTableSkeleton,
  EmptyStateMessage,
} from '@/shared/components';

import { columns } from '../constants';

const RequestsTable = () => {
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();

  const { requests, isLoading: requestsLoading } = useGetRecentRequests({
    role: currentUser?.role,
  });

  const isLoading = userLoading || requestsLoading;

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  if (requests.length === 0) {
    return <EmptyStateMessage message='No requests found' />;
  }

  return <DataTable columns={columns} data={requests} />;
};
export default RequestsTable;
