'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLogout } from '@/services/auth/hooks/useLogout';

import { AccountDetailsCard } from './AccountDetailsCard';
import { ActivitySummaryCard } from './ActivitySummaryCard';
import { LogoutModal } from './LogoutModal';
import { ProfileHeaderCard } from './ProfileHeaderCard';

export const ProfileContainer = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { logout, isLoading } = useLogout();
  const router = useRouter();

  const closeLogoutModal = () => setIsLogoutOpen(false);

  const handleLogoutConfirm = () => {
    if (!isLoading) {
      logout();
    }
  };

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
        isOpen={isLogoutOpen}
        onCloseAction={closeLogoutModal}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoading}
      />
    </main>
  );
};
