'use client';

import { useRouter } from 'next/navigation';

import { useGetCurrentUserQuery } from '@/services/auth/api/auth-api-service';

import { useLogoutModal } from '../hooks/useLogoutModal';
import { getDisplayName, getProfileRole } from '../utils/userDisplay';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ActivitySummaryCard } from './ActivitySummaryCard';
import { AdminAccountsCard } from './AdminAccountsCard';
import { LogoutModal } from './LogoutModal';
import { ProfileHeaderCard } from './ProfileHeaderCard';

export const ProfileContainer = () => {
  const { isOpen, isLoading, close, confirm } = useLogoutModal();
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();
  const userRole = currentUser?.role;
  const displayName = getDisplayName(currentUser);
  const profileRole = getProfileRole(currentUser);

  return (
    <main className='space-y-5'>
      <ProfileHeaderCard
        name={displayName}
        role={profileRole}
        email={currentUser?.email ?? '—'}
        phone={currentUser?.phone_number ?? '—'}
        organization={currentUser?.place_of_work ?? '—'}
        avatarUrl={currentUser?.avatar_url ?? null}
        onEditClick={() => router.push('/settings')}
      />
      <div className='grid gap-5 xl:grid-cols-[1.15fr_1fr]'>
        <AccountDetailsCard />
        {userRole === 'provider' ? (
          <ActivitySummaryCard />
        ) : (
          <AdminAccountsCard />
        )}
      </div>
      <LogoutModal
        isOpen={isOpen}
        onCloseAction={close}
        onConfirm={confirm}
        isLoading={isLoading}
      />
    </main>
  );
};
