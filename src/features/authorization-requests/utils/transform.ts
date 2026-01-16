import {
  type AuthorizationRequestsFilters,
  type AuthorizationRequestsParams,
} from '@/services';
import { buildRequestsParams } from '@/services/requests/utils/params';

export const buildAuthorizationRequestsParams = ({
  page = 1,
  filters,
}: {
  page?: number;
  filters?: AuthorizationRequestsFilters;
}): AuthorizationRequestsParams => {
  return buildRequestsParams({ page, filters });
};
