import { format } from 'date-fns';

import { type RequestStatus } from '@/services/dashboard';
import { type IRequestDetails } from '@/services/requests';
import { buildRequestsParams } from '@/services/requests/utils/params';

import { TIMELINE_STATUS_TITLE } from '../constants';
import { type IDetail, type IFilters } from '../types';

export const filtersToParams = ({
  pageIndex,
  date,
  searchQuery,
  status,
}: { pageIndex: number } & IFilters) => {
  return buildRequestsParams({
    page: pageIndex + 1,
    filters: {
      date,
      searchQuery,
      status,
    },
  });
};

export const getRequestDetailsBlocks = (data?: IRequestDetails): IDetail[] => {
  if (!data) {
    return [];
  }

  return [
    {
      label: 'Patient Name',
      value: `${data.patient_first_name} ${data.patient_last_name}`,
      className: 'shrink grow basis-[288px]',
    },
    {
      label: 'Transportation Type',
      value: data.transportation_type,
      className: 'shrink grow basis-[288px] capitalize',
    },
    {
      label: 'Date Submitted',
      value: format(data.created_at, 'MM/dd/yyyy'),
      className: 'shrink grow basis-[288px]',
    },
    {
      label: 'Pickup Address',
      value: data.pickup_address,
      className: 'shrink grow basis-[288px]',
    },
    {
      label: 'Destination Address',
      value: data.destination_address,
      className: 'shrink grow basis-[288px]',
    },
  ];
};

export const transformStatusToTimelineTitle = (status: RequestStatus) =>
  TIMELINE_STATUS_TITLE[status];
