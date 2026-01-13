'use client';

import { BellDot, type icons, Settings } from 'lucide-react';
import Link from 'next/link';

import {
  getDisplayName,
  getProfileRole,
  LogoutModal,
  useLogoutModal,
} from '@/features/profile';
import { useGetCurrentUserQuery } from '@/services';
import {
  Button,
  GlobalSearch,
  Header,
  HeaderActions,
  HeaderGroup,
  HeaderProfile,
  type ProfileAction,
} from '@/shared/components';
import { HeaderSkeleton } from '@/shared/components/header/skeleton';
import { cn } from '@/shared/lib/utils';

type AppHeaderProps = {
  isSearchOpen: boolean;
  onSearchOpenChange: (_open: boolean) => void;
};

export const AppHeader = ({
  isSearchOpen,
  onSearchOpenChange,
}: AppHeaderProps) => {
  const { isOpen, isLoading, open, close, confirm } = useLogoutModal();
  const { data: currentUser, isLoading: isUserLoading } =
    useGetCurrentUserQuery();
  const displayName = getDisplayName(currentUser);
  const profileRole = getProfileRole(currentUser);
  const avatarSrc = currentUser?.avatar_url || null;
  const searchOpen = Boolean(isSearchOpen);

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

  if (isUserLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      <Header
        className={cn('relative z-20 row-span-1 mx-10 mt-9', {
          'z-30': searchOpen,
        })}
      >
        <GlobalSearch
          size='medium'
          placeholder='Search patients or requests'
          isOpen={searchOpen}
          onOpenChange={onSearchOpenChange}
        />

        {!searchOpen ? (
          <HeaderGroup separate>
            {currentUser?.role !== 'admin' && (
              <HeaderActions>
                <Button variant='ghost' size='icon' asChild>
                  <Link href='/settings'>
                    <Settings className='text-status-info size-5' />
                  </Link>
                </Button>
                <Button variant='ghost' size='icon'>
                  <Link href='/notifications'>
                    <BellDot className='text-status-destructive size-5' />
                  </Link>
                </Button>
              </HeaderActions>
            )}
            <HeaderProfile
              src={avatarSrc}
              name={displayName}
              role={profileRole}
              actions={profileActions}
              isLoading={isUserLoading}
            />
          </HeaderGroup>
        ) : null}
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
