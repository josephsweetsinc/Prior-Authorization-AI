import { type JSX } from 'react';

import { OrganizationSettingsForm } from '@/features/settings/components/OrganizationSettingsForm';
import { OverlayIcon, Window } from '@/shared/components';

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
      <OrganizationSettingsForm />
    </Window>
  );
};
