import { type JSX } from 'react';

import { TitleAndDesc } from '@/shared/components';
import {
  AccountSettings,
  OrganizationSettings,
  SecuritySettings,
} from '@/views/settings';

export const SettingsFlow = (): JSX.Element => {
  return (
    <>
      <TitleAndDesc
        title='Settings'
        subtitle='Manage your account preferences and organization settings'
      />
      <div className='mt-6 flex flex-col gap-5'>
        <AccountSettings />
        <OrganizationSettings />
        <SecuritySettings />
      </div>
    </>
  );
};
