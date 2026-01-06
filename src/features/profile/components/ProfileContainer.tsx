'use client';

import { useRouter } from 'next/navigation';

import { useLogoutModal } from '../hooks/useLogoutModal';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ActivitySummaryCard } from './ActivitySummaryCard';
import { LogoutModal } from './LogoutModal';
import { ProfileHeaderCard } from './ProfileHeaderCard';

export const ProfileContainer = () => {
  const { isOpen, isLoading, close, confirm } = useLogoutModal();
  const router = useRouter();

  return (
    <main className='space-y-5'>
      <ProfileHeaderCard
        name='Dr. Kraude'
        role='Ambulance Provider'
        email='s.mitchell@medevac.org'
        phone='(555) 234-5678'
        organization='Metro Emergency Medical Services'
        onEditClick={() => router.push('/settings')}
      />
      <div className='grid gap-5 xl:grid-cols-[1.15fr_1fr]'>
        <AccountDetailsCard />
        <ActivitySummaryCard />
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
