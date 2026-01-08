import { cn } from '@/shared/lib/utils';

import { Button } from '../button';

interface FilterTabProps {
  title?: string;
  rowsCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const FilterTab = ({
  title = 'Filter',
  rowsCount = 0,
  isActive = false,
  onClick,
}: FilterTabProps) => {
  return (
    <Button
      variant={isActive ? 'primary' : 'ghost'}
      size='sm'
      className={cn(
        'w-auto rounded-[20px] px-6 py-2.5',
        isActive && 'bg-[#047CB4] font-semibold',
      )}
      onClick={onClick}
    >
      {title} {rowsCount > 0 && `(${rowsCount})`}
    </Button>
  );
};
