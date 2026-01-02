'use client';

import { RequestDetails, useRequestDetails } from '@/features/requests-history';
import { useGetCurrentUserQuery } from '@/services/auth';
import { useGetRecentRequests } from '@/services/recent-requests';
import {
  DataTable,
  DataTableSkeleton,
  EmptyStateMessage,
} from '@/shared/components';

import { useGetColumns } from '../hooks';

const RequestsTable = () => {
  const { details, handleDetailsClick, handleDetailsClose } =
    useRequestDetails();
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();

  const { requests, isLoading: requestsLoading } = useGetRecentRequests({
    role: currentUser?.role,
  });

  const columns = useGetColumns({ onDetailsClick: handleDetailsClick });

  const isLoading = userLoading || requestsLoading;

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }

  if (requests.length === 0) {
    return <EmptyStateMessage message='No requests found' />;
  }

  return (
    <>
      <DataTable columns={columns} data={requests} />
      {details.requestId && (
        <RequestDetails
          requestId={details.requestId!}
          open={details.open}
          onClose={handleDetailsClose}
        />
      )}
    </>
  );
};
export default RequestsTable;
