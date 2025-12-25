import { type RequestStatus } from '@/services/dashboard';
import { Chip } from '@/shared/components';

import { STATUS_CONFIG } from '../constants';

export const RequestStatusChip = ({ status }: { status: RequestStatus }) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <Chip size='sm' variant='warning' label='Unknown' />;
  }

  return <Chip size='sm' {...config} />;
};
