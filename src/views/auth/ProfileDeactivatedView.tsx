import { type JSX } from 'react';

import { Button } from '@/shared/components';

export function ProfileDeactivatedView(): JSX.Element {
  return (
    <div className='w-full space-y-8 px-10'>
      <div>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Profile Deactivated
        </h1>
        <p className='text-gray-dark text-[18px]'>
          Your account has been deactivated. Please contact your system
          administrator to regain access.
        </p>
      </div>
      <Button variant='primary' size='default' asChild>
        <a href='mailto:health.paai@gmail.com'>Apply for approval</a>
      </Button>
    </div>
  );
}
