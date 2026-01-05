import { Plus } from 'lucide-react';
import { type HTMLProps } from 'react';

import { Button, TitleAndDesc } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

type Props = {
  onCreateClick: VoidFunction;
} & HTMLProps<HTMLDivElement>;

export const UserManagementHeader = ({
  onCreateClick,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-8',
        className,
      )}
      {...props}
    >
      <TitleAndDesc
        title='User Management'
        subtitle='Manage system users and their permissions'
      />

      <Button
        variant='primary'
        className='aspect-square w-max lg:aspect-auto lg:px-16! lg:py-2.5!'
        onClick={onCreateClick}
      >
        <Plus className='size-4' />
        <span className='sr-only text-base font-medium tracking-wide lg:not-sr-only'>
          Add User
        </span>
      </Button>
    </div>
  );
};
