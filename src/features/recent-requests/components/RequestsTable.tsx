'use client';

import { useGetProviderRecentRequests } from '@/services/recent-requests';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { columns } from '../constants';

const RequestsTable = () => {
  const { requests, isLoading } = useGetProviderRecentRequests();

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  return <DataTable columns={columns} data={requests} />;
};
export default RequestsTable;
