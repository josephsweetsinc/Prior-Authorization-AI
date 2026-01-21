import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

const Root = ({
  onClick,
  children,
  className,
  ...props
}: Omit<HTMLProps<HTMLButtonElement>, 'type'>) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left transition hover:bg-[#EAF7FE]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Title = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => (
  <span
    className={cn('text-sm font-medium text-slate-800', className)}
    {...props}
  >
    {children}
  </span>
);

const Subtitle = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLSpanElement>) => (
  <span className={cn('text-xs text-slate-500', className)} {...props}>
    {children}
  </span>
);

export const SearchItem = Object.assign(Root, {
  Title,
  Subtitle,
});
