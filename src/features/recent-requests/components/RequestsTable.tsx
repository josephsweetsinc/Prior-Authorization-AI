'use client';

import { RequestDetails, useRequestDetails } from '@/features/requests-history';
import { useGetCurrentUserQuery } from '@/services/auth';
import { useGetRecentRequests } from '@/services/recent-requests';
import { DataTable } from '@/shared/components';

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
