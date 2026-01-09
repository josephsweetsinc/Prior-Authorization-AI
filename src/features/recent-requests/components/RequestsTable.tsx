'use client';

import { RequestDetails, useRequestDetails } from '@/features/requests-history';
import { useGetCurrentUserQuery } from '@/services/auth';
import { useGetRecentRequests } from '@/services/recent-requests';
import { DataTable, EmptyStateMessage } from '@/shared/components';

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

  if (requests.length === 0) {
    return <EmptyStateMessage message='No requests found' />;
  }

  return (
    <>
      <DataTable columns={columns} data={requests}>
        <DataTable.Header />
        <DataTable.Body isLoading={isLoading} />
      </DataTable>
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
