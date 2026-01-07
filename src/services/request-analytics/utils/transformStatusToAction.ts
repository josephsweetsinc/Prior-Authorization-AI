import { type RequestStatus } from '@/services/dashboard';

import { ACTION_STATUS_TITLE } from '../constants';

export function transformStatusToAction(status: RequestStatus): string {
  return ACTION_STATUS_TITLE[status];
}
