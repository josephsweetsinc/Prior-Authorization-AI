import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

type Props = {
  label: string;
  value: string;
} & HTMLProps<HTMLDivElement>;

export const DataBlock = ({ label, value, className, ...props }: Props) => {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <p className='text-muted-blue text-sm'>{label + ':'}</p>
      <p className='text-base font-bold text-black'>{value}</p>
    </div>
  );
};
