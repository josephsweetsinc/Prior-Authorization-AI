'use client';

import { BellDot, type icons, Settings } from 'lucide-react';
import Link from 'next/link';

import { useUnreadNotificationsCount } from '@/features/notifications';
import { LogoutModal } from '@/features/profile/components/LogoutModal';
import { useLogoutModal } from '@/features/profile/hooks/useLogoutModal';
import {
  getDisplayName,
  getProfileRole,
} from '@/features/profile/utils/userDisplay';
import { useGetCurrentUserQuery } from '@/services';
import {
  Button,
  GlobalSearch,
  Header,
  HeaderActions,
  HeaderGroup,
  HeaderProfile,
  NotificationBadge,
  type ProfileAction,
} from '@/shared/components';

export const AppHeader = () => {
  const { isOpen, isLoading, open, close, confirm } = useLogoutModal();
  const { data: currentUser, isLoading: isUserLoading } =
    useGetCurrentUserQuery();
  const displayName = getDisplayName(currentUser);
  const profileRole = getProfileRole(currentUser);
  const avatarSrc = currentUser?.avatar_url || null;

  const { count: unreadCount } = useUnreadNotificationsCount();

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
      onClick: open,
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
            {currentUser?.role !== 'admin' && (
              <Button variant='ghost' size='icon' asChild>
                <Link href='/settings'>
                  <Settings className='text-status-info size-5' />
                </Link>
              </Button>
            )}
            <Button variant='ghost' size='icon' asChild>
              <Link href='/notifications' className='relative'>
                <BellDot className='text-status-destructive size-5' />
                <NotificationBadge count={unreadCount} />
              </Link>
            </Button>
          </HeaderActions>

          <HeaderProfile
            src={avatarSrc}
            name={displayName}
            role={profileRole}
            actions={profileActions}
            isLoading={isUserLoading}
          />
        </HeaderGroup>
      </Header>
      <LogoutModal
        isOpen={isOpen}
        onCloseAction={close}
        onConfirm={confirm}
        isLoading={isLoading}
      />
    </>
  );
};
