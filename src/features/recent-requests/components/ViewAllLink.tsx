'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { type HTMLProps } from 'react';

import { useIsAdmin } from '@/services/auth/hooks';
import { cn } from '@/shared/lib/utils';

export const ViewAllLink = ({
  className,
  ...props
}: HTMLProps<HTMLAnchorElement>) => {
  const { isAdmin, isLoading } = useIsAdmin();
  const url = isAdmin ? '/requests' : '/requests-history';

  return (
    <Link
      className={cn(
        'text-brand-dark flex items-center gap-2 capitalize underline',
        { 'pointer-events-none': isLoading },
        className,
      )}
      href={url}
      aria-disabled={isLoading}
      {...props}
    >
      <span>View all</span>
      <ArrowUpRight className='size-5' />
    </Link>
  );
};
