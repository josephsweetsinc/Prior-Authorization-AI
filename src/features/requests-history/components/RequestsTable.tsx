import { type PaginationState } from '@tanstack/react-table';

import { type IRequestHistoryResponse } from '@/services/requests';
import { DataTable } from '@/shared/components';

import { useGetColumns, useRequestDetails } from '../hooks';

import { RequestDetails } from './RequestDetails';

type Props = {
  data?: IRequestHistoryResponse;
  pagination: PaginationState;
  onPaginationChange: (_state: PaginationState) => void;
  isLoading?: boolean;
  initialRequestId?: number;
};

export const RequestsTable = ({
  data,
  isLoading,
  pagination,
  onPaginationChange,
  initialRequestId,
}: Props) => {
  const { details, handleDetailsClick, handleDetailsClose } =
    useRequestDetails(initialRequestId);
  const requestId =
    typeof details.requestId === 'number' ? details.requestId : undefined;

  const columns = useGetColumns({
    onDetailsClick: handleDetailsClick,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={data ? data.items : []}
        pagination
        manualPagination
        paginationState={pagination}
        onPaginationChange={onPaginationChange}
        pageCount={data ? data.total_pages : 1}
        total={data ? data.total : pagination.pageSize}
      >
        <DataTable.Header />
        <DataTable.Body isLoading={isLoading} />
      </DataTable>
      {requestId !== undefined && (
        <RequestDetails
          requestId={requestId}
          open={details.open}
          onClose={handleDetailsClose}
        />
      )}
    </>
  );
};
