import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

export const TableHeadCell = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLElement>) => {
  return (
    <span
      className={cn(
        'text-gray-dark text-base font-medium uppercase',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
