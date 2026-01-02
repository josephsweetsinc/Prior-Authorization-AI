import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

type Props = {
  label: string;
  value: string;
} & HTMLProps<HTMLDivElement>;

export const DataBlock = ({ label, value, className, ...props }: Props) => {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <p className='text-muted-blue text-xs md:text-sm'>{label + ':'}</p>
      <p className='text-xs font-bold text-black md:text-sm lg:text-base'>
        {value}
      </p>
    </div>
  );
};
