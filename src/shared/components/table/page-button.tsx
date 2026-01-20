import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

type Props = {
  active?: boolean;
} & Omit<HTMLProps<HTMLButtonElement>, 'type'>;

export const PageButton = ({
  children,
  active,
  disabled,
  onClick,
  className,
  ...props
}: Props) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm transition-colors',
        {
          'cursor-not-allowed opacity-40': disabled,
          'bg-accent-foreground text-primary-foreground': active,
          'hover:bg-muted text-muted-foreground': !active,
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
