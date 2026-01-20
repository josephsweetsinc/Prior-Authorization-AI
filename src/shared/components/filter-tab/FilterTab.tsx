import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Button } from '../button';

type Props = {
  label?: string;
  rowsCount?: number;
  isActive?: boolean;
} & Omit<HTMLProps<HTMLButtonElement>, 'size' | 'type'>;

export const FilterTab = ({
  label = 'Filter',
  rowsCount = 0,
  isActive = false,
  onClick,
  className,
  ...props
}: Props) => {
  return (
    <Button
      variant={isActive ? 'primary' : 'ghost'}
      size='sm'
      className={cn(
        'w-auto rounded-[20px] px-6 py-2.5',
        {
          'bg-status-info font-semibold': isActive,
        },
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {label} {rowsCount > 0 && `(${rowsCount})`}
    </Button>
  );
};
