'use client';

import { useState } from 'react';

import { WebSocketInitializer } from '@/features/websocket';
import { AppHeader, AppSidebar } from '@/views/layout';

type MainLayoutShellProps = {
  children: React.ReactNode;
};

export const MainLayoutShell = ({ children }: MainLayoutShellProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className='bg-secondary grid max-h-dvh grid-cols-[minmax(290px,20.138%)_1fr] grid-rows-[max-content_1fr]'>
      <WebSocketInitializer />
      <AppSidebar />
      <div className='relative col-start-2 row-span-2 flex min-h-0 flex-col'>
        <AppHeader
          isSearchOpen={isSearchOpen}
          onSearchOpenChange={setIsSearchOpen}
        />
        <main className='max-h-dvh overflow-y-auto p-10'>{children}</main>
        {isSearchOpen && (
          <div
            className='bg-dialog-backdrop absolute inset-0 z-10 backdrop-blur-xs'
            onClick={() => setIsSearchOpen(false)}
            aria-hidden='true'
          />
        )}
      </div>
    </div>
  );
};
