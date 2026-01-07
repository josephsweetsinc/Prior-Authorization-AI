import { type JSX } from 'react';

import { AccountSettingsForm } from '@/features/settings/components';
import { OverlayIcon, Window } from '@/shared/components';

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
      <AccountSettingsForm />
    </Window>
  );
};
