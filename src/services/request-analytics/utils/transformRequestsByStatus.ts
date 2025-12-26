import { type RequestsByStatus } from '@/services/dashboard';
import { type DonutDatum } from '@/shared/components';

import { STATUS_CHART_CONFIG } from '../constants';

export function transformRequestsByStatus(
  data: RequestsByStatus[],
): DonutDatum[] {
  return data
    .filter((item) => item.count > 0)
    .map(({ status, count }) => ({
      label: STATUS_CHART_CONFIG[status].label,
      value: count,
      color: STATUS_CHART_CONFIG[status].color,
    }));
}
