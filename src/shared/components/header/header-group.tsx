import { Children, forwardRef, Fragment, type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

import { Separator, type SeparatorColor } from '../separator';

export type HeaderGroupProps = {
  separate?: boolean;
  separatorColor?: SeparatorColor;
} & HTMLProps<HTMLDivElement>;

export const HeaderGroup = forwardRef<HTMLDivElement, HeaderGroupProps>(
  ({ children, separate, separatorColor, className, ...props }, ref) => {
    const items = Children.toArray(children);

    const shouldRenderDivider = (index: number) =>
      separate && items.length > 1 && index < items.length - 1;

    return (
      <div
        className={cn('flex items-center gap-5', className)}
        ref={ref}
        {...props}
      >
        {items.map((child, index) => (
          <Fragment key={index}>
            {child}
            {shouldRenderDivider(index) && (
              <Separator
                orientation='vertical'
                // should be workaround on how impl set of sizes / flexible height
                className='h-10!'
                // Got tricky ts warns when tried to set fallback on prop instead of where it is now.
                color={separatorColor ?? 'info'}
              />
            )}
          </Fragment>
        ))}
      </div>
    );
  },
);

HeaderGroup.displayName = 'HeaderGroup';
