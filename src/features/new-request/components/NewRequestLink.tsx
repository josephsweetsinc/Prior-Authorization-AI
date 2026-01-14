'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { useGetCurrentUserQuery } from '@/services';
import { buttonVariants } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

export const NewRequestLink = () => {
  const { data: currentUser } = useGetCurrentUserQuery();

  if (!currentUser || currentUser.role === 'admin') {
    return;
  }

  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'primary' }),
        'aspect-square w-max p-3 text-base font-medium capitalize xl:aspect-auto xl:rounded-[12px] xl:px-10! xl:py-3!',
      )}
      href='/new-request'
    >
      <Plus className='size-4' />
      <span className='sr-only xl:not-sr-only'>New request</span>
    </Link>
  );
};
