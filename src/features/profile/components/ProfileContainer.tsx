'use client';

import { useRouter } from 'next/navigation';

import { useGetCurrentUserQuery } from '@/services/auth/api/auth-api-service';

import { useLogoutModal } from '../hooks/useLogoutModal';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ActivitySummaryCard } from './ActivitySummaryCard';
import { AdminAccountsCard } from './AdminAccountsCard';
import { LogoutModal } from './LogoutModal';
import { ProfileHeaderCard } from './ProfileHeaderCard';

export const ProfileContainer = () => {
  const { isOpen, isLoading, close, confirm } = useLogoutModal();
  const router = useRouter();
  const { data: currentUser } = useGetCurrentUserQuery();
  const fullName = [currentUser?.name, currentUser?.surname]
    .filter(Boolean)
    .join(' ');
  const displayName = fullName || currentUser?.email || '—';
  const roleLabel = currentUser?.role
    ? currentUser.role[0].toUpperCase() + currentUser.role.slice(1)
    : '—';
  const userRole = currentUser?.role;
  const profileRole =
    currentUser?.role === 'provider' ? currentUser?.position || '—' : roleLabel;

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
