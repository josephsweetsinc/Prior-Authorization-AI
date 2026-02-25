import { type RequestsByStatus } from '@/services/dashboard';
import { type DonutDatum } from '@/shared/components';

import { STATUS_CHART_CONFIG } from '../constants';

export function transformRequestsByStatus(
  data: RequestsByStatus[],
): DonutDatum[] {
  const filtered = data.filter((item) => item.count > 0);

  const total = filtered.reduce((sum, item) => sum + item.count, 0);

  return filtered.map(({ status, count }) => ({
    label: STATUS_CHART_CONFIG[status].label,
    value: count,
    percentage: total > 0 ? (count / total) * 100 : 0,
    color: STATUS_CHART_CONFIG[status].color,
  }));
}
