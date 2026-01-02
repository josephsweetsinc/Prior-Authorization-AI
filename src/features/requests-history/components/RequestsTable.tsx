import { type IRequest } from '@/services/requests-history';
import { DataTable, DataTableSkeleton } from '@/shared/components';

import { columns } from '../constants';

type Props = { data: IRequest[]; isLoading?: boolean };

export const RequestsTable = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return <DataTableSkeleton columnCount={6} />;
  }
  return <DataTable columns={columns} data={data} pagination />;
};
