import { type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

const Card = ({ children, className }: HTMLProps<HTMLElement>) => {
  return (
    <article className={cn('rounded-lg bg-white p-5', className)}>
      {children}
    </article>
  );
};

const Group = ({ children, className }: HTMLProps<HTMLDivElement>) => {
  return <div className={className}>{children}</div>;
};

const Label = ({ children, className }: HTMLProps<HTMLHeadingElement>) => (
  <h3 className={cn('text-muted-blue text-base', className)}>{children}</h3>
);

const Value = ({ children, className }: HTMLProps<HTMLParagraphElement>) => (
  <p
    className={cn(
      'text-xl leading-tight font-semibold md:text-2xl xl:text-3xl',
      className,
    )}
  >
    {children}
  </p>
);

export default Object.assign(Card, {
  Label,
  Value,
  Group,
});
