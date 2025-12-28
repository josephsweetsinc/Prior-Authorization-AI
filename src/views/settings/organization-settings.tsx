import { type JSX } from 'react';

import { Button, Input, OverlayIcon, Window } from '@/shared/components';

export const OrganizationSettings = (): JSX.Element => {
  return (
    <Window className='space-y-8'>
      <div className='flex items-center gap-3'>
        <OverlayIcon variant='Building2' color='orange' />
        <div className='flex flex-col gap-2 text-start'>
          <h2 className='text-[22px] font-[700]'>Organization Settings</h2>
          <p className='text-lg font-[500]'>
            Manage your healthcare facility information
          </p>
        </div>
      </div>
      <div className='space-y-5'>
        <Input
          labelVariant='static'
          label='Facility Name'
          placeholder='Facility name'
        />
        <Input
          labelVariant='static'
          label='Provider Type'
          placeholder='Provider type'
        />

        <Input
          labelVariant='static'
          label='Professional ID'
          placeholder='Professional ID'
        />

        <Input
          labelVariant='static'
          label='Medic Name'
          placeholder='Medic name'
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
