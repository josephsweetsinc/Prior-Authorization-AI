import { Plus } from 'lucide-react';

import { Button, TitleAndDesc } from '@/shared/components';

const UserManagement = () => {
  return (
    <main className='space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-8'>
        <TitleAndDesc
          title='User Management'
          subtitle='Manage system users and their permissions'
        />

        <Button variant='primary' className='w-max px-16! py-2.5!' disabled>
          <Plus className='size-4' />
          <span className='text-base font-medium tracking-wide'>Add User</span>
        </Button>
      </div>
    </main>
  );
};

export default UserManagement;
