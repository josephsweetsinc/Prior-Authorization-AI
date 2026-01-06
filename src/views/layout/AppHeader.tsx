'use client';

import { BellDot, type icons, Settings } from 'lucide-react';
import { useState } from 'react';

import { LogoutModal } from '@/features/profile/components/LogoutModal';
import { useLogout } from '@/services/auth/hooks/useLogout';
import {
  Button,
  GlobalSearch,
  Header,
  HeaderActions,
  HeaderGroup,
  HeaderProfile,
  type ProfileAction,
} from '@/shared/components';

export const AppHeader = () => {
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const openLogoutModal = () => setIsLogoutOpen(true);
  const closeLogoutModal = () => setIsLogoutOpen(false);
  const handleLogoutConfirm = () => {
    if (!isLoggingOut) {
      logout();
    }
  };

  const profileActions: ProfileAction[] = [
    {
      type: 'link',
      label: 'My Account',
      href: '/profile',
      icon: 'CircleUserRound' as keyof typeof icons,
    },
    {
      type: 'action',
      label: 'Log Out',
      icon: 'LogOut' as keyof typeof icons,
      variant: 'destructive',
      onClick: openLogoutModal,
    },
  ] as const;

  return (
    <>
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
      <LogoutModal
        isOpen={isLogoutOpen}
        onCloseAction={closeLogoutModal}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
};
