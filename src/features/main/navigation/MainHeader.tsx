'use client';

import { BellDot, type icons, Settings } from 'lucide-react';

import {
  Button,
  GlobalSearch,
  Header,
  HeaderActions,
  HeaderGroup,
  HeaderProfile,
  type ProfileAction,
} from '@/shared/components';

const profileActions: ProfileAction[] = [
  {
    type: 'link',
    label: 'My Account',
    href: '/profile',
    icon: 'CircleUserRound' as keyof typeof icons,
  },
  {
    type: 'action',
    label: 'Sign Out',
    icon: 'LogOut' as keyof typeof icons,
    variant: 'destructive',
  },
] as const;

export const MainHeader = () => {
  return (
    <Header className='row-span-1 mx-10 mt-9'>
      <GlobalSearch
        size='medium'
        placeholder='Search patients or requests'
        disabled
      />

      <HeaderGroup separate>
        <HeaderActions>
          <Button variant='ghost' size='icon' disabled>
            <Settings className='text-status-info size-5' />
          </Button>
          <Button variant='ghost' size='icon' disabled>
            <BellDot className='text-status-destructive size-5' />
          </Button>
        </HeaderActions>
        <HeaderProfile
          src='/images/mock_avatar.jpg'
          name='Dr. Kraude'
          role='Ambulance'
          actions={profileActions}
        />
      </HeaderGroup>
    </Header>
  );
};
