'use client';

import { useState } from 'react';

import { useNotifications } from '@/services/websocket/hooks';
import { AppHeader, AppSidebar } from '@/views/layout';

type MainLayoutShellProps = {
  children: React.ReactNode;
};

export const MainLayoutShell = ({ children }: MainLayoutShellProps) => {
  useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className='bg-secondary grid max-h-dvh grid-cols-[290px_1fr] grid-rows-[max-content_1fr]'>
      <AppSidebar />
      <div className='relative col-start-2 row-span-2 flex max-h-dvh min-h-0 flex-col overflow-y-auto'>
        <AppHeader
          isSearchOpen={isSearchOpen}
          onSearchOpenChange={setIsSearchOpen}
        />
        <main className='p-10'>{children}</main>
        {isSearchOpen && (
          <div
            className='bg-dialog-backdrop fixed inset-0 z-10 backdrop-blur-xs'
            onClick={() => setIsSearchOpen(false)}
            aria-hidden='true'
          />
        )}
      </div>
    </div>
  );
};
