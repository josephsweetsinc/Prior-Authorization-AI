'use client';

import { useGetProviderRecentRequests } from '@/services/recent-requests';
import {
  DataTable,
  DataTableSkeleton,
  EmptyStateMessage,
} from '@/shared/components';

import { columns } from '../constants';

const RequestsTable = () => {
  const { requests, isLoading } = useGetProviderRecentRequests();

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  if (requests.length === 0) {
    return <EmptyStateMessage message='No requests found' />;
  }

  return <DataTable columns={columns} data={requests} />;
};
export default RequestsTable;
