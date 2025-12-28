import { type JSX } from 'react';

import { Button, Input, OverlayIcon, Window } from '@/shared/components';

export const AccountSettings = (): JSX.Element => {
  return (
    <Window className='space-y-8'>
      <div className='flex items-center gap-3'>
        <OverlayIcon variant='UserRound' color='blue' />
        <div className='flex flex-col gap-2 text-start'>
          <h2 className='text-[22px] font-[700]'>Account Settings</h2>
          <p className='text-lg font-[500]'>
            Update your personal information and credentials
          </p>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-5'>
        <Input labelVariant='static' label='First Name' />
        <Input labelVariant='static' label='Last Name' />
        <Input labelVariant='static' label='Email' />
        <Input labelVariant='static' label='Phone' />
        <Input labelVariant='static' label='Position' />
        <Input labelVariant='static' label='Place of Work' />
      </div>
      <div className='flex justify-end'>
        <Button variant='primary' size='default' className='w-fit'>
          Update Information
        </Button>
      </div>
    </Window>
  );
};
