import { type JSX } from 'react';

import { Button, Input, OverlayIcon, Window } from '@/shared/components';

export const SecuritySettings = (): JSX.Element => {
  return (
    <Window className='space-y-8'>
      <div className='flex items-center gap-3'>
        <OverlayIcon variant='Shield' color='green' />
        <div className='flex flex-col gap-2 text-start'>
          <h2 className='text-[22px] font-[700]'>Security Settings</h2>
          <p className='text-lg font-[500]'>
            Update your password and protect account
          </p>
        </div>
      </div>
      <div className='space-y-5'>
        <Input
          labelVariant='static'
          label='Current Password'
          type='password'
          placeholder='Enter password'
        />
        <Input
          labelVariant='static'
          label='New Password'
          type='password'
          placeholder='Enter password'
        />

        <Input
          labelVariant='static'
          label='Confirm Password'
          type='password'
          placeholder='Confirm password'
        />
      </div>
      <div className='flex justify-end'>
        <Button variant='primary' size='default' className='w-fit'>
          Update Information
        </Button>
      </div>
    </Window>
  );
};
