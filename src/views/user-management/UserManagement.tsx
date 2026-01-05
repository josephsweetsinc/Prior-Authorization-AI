import { Plus } from 'lucide-react';

import { UserManagementContainer } from '@/features/user-management';
import { Button, TitleAndDesc } from '@/shared/components';

const UserManagement = () => {
  return (
    <main className='space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-8'>
        <TitleAndDesc
          title='User Management'
          subtitle='Manage system users and their permissions'
        />

        <Button
          variant='primary'
          className='aspect-square w-max lg:aspect-auto lg:px-16! lg:py-2.5!'
          disabled
        >
          <Plus className='size-4' />
          <span className='sr-only text-base font-medium tracking-wide lg:not-sr-only'>
            Add User
          </span>
        </Button>
      </div>

      <UserManagementContainer />
    </main>
  );
};

export default UserManagement;
