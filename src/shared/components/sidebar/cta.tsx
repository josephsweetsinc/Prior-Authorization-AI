import { icons } from 'lucide-react';
import Link from 'next/link';
import { forwardRef, type HTMLProps } from 'react';

import { cn } from '@/shared/lib/utils';

export type SidebarCTAProps = {
  title: string;
  body: string;
  link: {
    label: string;
    to: string;
  };
  icon?: keyof typeof icons;
} & HTMLProps<HTMLDivElement>;

export const SidebarCTA = forwardRef<HTMLDivElement, SidebarCTAProps>(
  ({ title, body, link, className, icon, ...props }, ref) => {
    const Icon = icon ? icons[icon] : null;

    return (
      <article
        ref={ref}
        className={cn(
          'bg-primary-gradient relative flex flex-col items-center rounded-[24px] px-6 py-4.25 text-center text-sm text-white',
          { 'pt-14.25': !!icon },
          className,
        )}
        {...props}
      >
        {Icon && (
          <div className='bg-primary-gradient absolute inset-x-1/2 top-0 flex aspect-square w-23.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white'>
            <Icon className='size-10 text-white' />
          </div>
        )}
        <p className='text-lg leading-7 font-bold'>{title}</p>
        <p className='leading-4.9 mb-4 text-sm font-medium'>{body}</p>
        <Link
          href={link.to}
          className='text-sidebar-foreground block w-full rounded-full bg-white px-4 py-2 text-sm font-medium uppercase'
        >
          {link.label}
        </Link>
      </article>
    );
  },
);
SidebarCTA.displayName = 'SidebarCTA';
