'use client';

import { AccountDetailsCardSkeleton } from './AccounDetailsCardSkeleton';
import { ProfileHeaderCardSkeleton } from './ProfileHeaderCardSkeleton';
import { SideCardSkeleton } from './SideCardSkeleton';

export const ProfileContainerSkeleton = () => {
  return (
    <main className='space-y-5'>
      <ProfileHeaderCardSkeleton />

      <div className='grid gap-5 xl:grid-cols-[1.15fr_1fr]'>
        <AccountDetailsCardSkeleton />
        <SideCardSkeleton />
      </div>
    </main>
  );
};
