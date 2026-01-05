'use client';

import { useGetCurrentUserQuery } from '@/services';
import LogoIcon from '@/shared/assets/icons/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarCTA,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from '@/shared/components';

export const AppSidebar = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Sidebar className='row-span-2'>
      <SidebarHeader className='flex items-center'>
        <LogoIcon />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup aria-label='Main Navigation'>
          <SidebarItem icon='LayoutDashboard' label='Dashboard' to='/' />
          {isLoading ? null : isAdmin ? (
            <>
              <SidebarItem icon='FileText' label='Requests' to='/requests' />
              <SidebarItem
                icon='Users'
                label='User Management'
                to='/user-management'
              />
              <SidebarItem icon='FileChartLine' label='Reports' to='/reports' />
            </>
          ) : (
            <>
              <SidebarItem
                icon='FileChartColumnIncreasing'
                label='New Request'
                to='/new-request'
              />
              <SidebarItem
                icon='ClockFading'
                label='Requests History'
                to='/requests-history'
                disabled
              />
              <SidebarItem icon='Settings' label='Settings' to='/settings' />
            </>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarCTA
          icon='Plus'
          title='Take the next step'
          body='Stay organized and ahead of your work.'
          link={{
            label: 'Start',
            to: '/new-request',
          }}
        >
          <p className='font-medium'>Upgrade to Pro</p>
          <p className='text-muted-foreground'>Unlock advanced features.</p>
        </SidebarCTA>
      </SidebarFooter>
    </Sidebar>
  );
};
