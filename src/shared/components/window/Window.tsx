import type { ReactNode, ReactElement } from 'react';

import { cn } from '@/shared/lib/utils';

type WindowProps = {
  children?: ReactNode;
  className?: string;
};

export const Window = ({ children, className }: WindowProps): ReactElement => {
  return (
    <div className={cn('rounded-[20px] bg-white p-10', className)}>
      {children}
    </div>
  );
};
