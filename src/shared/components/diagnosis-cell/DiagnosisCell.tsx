import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

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
  if (!diagnosis || diagnosis.length === 0) {
    return (
      <span className={cn('text-base text-black', className)} {...props}>
        -
      </span>
    );
  }

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
