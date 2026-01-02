import { type IRequest } from '@/services/requests-history';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { useGetColumns, useRequestDetails } from '../hooks';

import { RequestDetails } from './RequestDetails';

type Props = { data: IRequest[]; isLoading?: boolean };

export const RequestsTable = ({ data, isLoading }: Props) => {
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
      <DataTable columns={columns} data={data} pagination />
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
