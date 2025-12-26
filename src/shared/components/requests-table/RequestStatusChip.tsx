import { type RequestStatus } from '@/services/dashboard';
import { Chip } from '@/shared/components';

export const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; variant: 'info' | 'warning' | 'success' | 'destructive' }
> = {
  approved: { label: 'Approved', variant: 'success' },
  pending: { label: 'Pending ', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  denied: { label: 'Denied', variant: 'destructive' },
} as const;

export const RequestStatusChip = ({ status }: { status: RequestStatus }) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <Chip size='sm' variant='warning' label='Unknown' />;
  }

  return <Chip size='sm' {...config} />;
};
