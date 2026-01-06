import { type JSX } from 'react';

import { SecuritySettingsForm } from '@/features/settings/components/SecuritySettingsForm';
import { OverlayIcon, Window } from '@/shared/components';

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
      <SecuritySettingsForm />
    </Window>
  );
};
