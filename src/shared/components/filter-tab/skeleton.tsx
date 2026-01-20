import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Skeleton } from '../skeleton';

type Props = {
  withCount?: boolean;
  isActive?: boolean;
} & HTMLProps<HTMLDivElement>;

export const FilterTabSkeleton = ({
  withCount = false,
  isActive = false,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'flex items-center rounded-[20px] px-6 py-2.5',
        { 'bg-white': isActive },
        className,
      )}
      {...props}
    >
      <Skeleton className={cn('h-4 w-20', { 'bg-white': !isActive })} />
      {withCount && (
        <Skeleton className={cn('ml-2 h-4 w-6', { 'bg-white': !isActive })} />
      )}
    </div>
  );
};
