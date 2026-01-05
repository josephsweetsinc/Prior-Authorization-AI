import { Chip, type ChipProps } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = {
  status: 'active' | 'inactive';
} & Omit<ChipProps, 'label' | 'variant' | 'status'>;

export const StatusChip = ({ status, className, ...props }: Props) => {
  const chipVariant = status === 'active' ? 'success' : 'default';

  return (
    <Chip
      label={status}
      variant={chipVariant}
      className={cn('capitalize', className)}
      {...props}
    />
  );
};
