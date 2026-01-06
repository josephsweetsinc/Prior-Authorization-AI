import { type PaginationState } from '@tanstack/react-table';

import { type IRequestHistoryResponse } from '@/services/requests-history';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { useGetColumns, useRequestDetails } from '../hooks';

import { RequestDetails } from './RequestDetails';

type Props = {
  data?: IRequestHistoryResponse;
  pagination: PaginationState;
  // eslint-disable-next-line no-unused-vars
  onPaginationChange: (state: PaginationState) => void;
  isLoading?: boolean;
};

export const RequestsTable = ({
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: Props) => {
  const { details, handleDetailsClick, handleDetailsClose } =
    useRequestDetails();

  const columns = useGetColumns({
    onDetailsClick: handleDetailsClick,
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }
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
      />
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
