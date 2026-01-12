import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/tooltip';

type Props = {
  diagnosis: string;
  limit?: number;
} & HTMLProps<HTMLElement>;

export const DiagnosisCell = ({
  diagnosis,
  limit = 40,
  className,
  ...props
}: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className={cn('text-base text-black', className)} {...props}>
          {diagnosis?.length >= limit
            ? `${diagnosis.substring(0, limit)}...`
            : diagnosis}
        </span>
      </TooltipTrigger>
      <TooltipContent>{diagnosis}</TooltipContent>
    </Tooltip>
  );
};
