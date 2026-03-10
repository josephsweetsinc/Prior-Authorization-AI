import { Chip, type ChipProps } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = {
  status: 'active' | 'inactive' | 'deactivated';
} & Omit<ChipProps, 'label' | 'variant' | 'status'>;

const variantMap = {
  active: 'success',
  inactive: 'default',
  deactivated: 'destructive',
} as const;

export const StatusChip = ({ status, className, ...props }: Props) => {
  const chipVariant = variantMap[status];

  return (
    <Chip
      label={status}
      variant={chipVariant}
      className={cn('capitalize', className)}
      {...props}
    />
  );
};
