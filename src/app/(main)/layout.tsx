import { BellDot, Settings } from 'lucide-react';

import LogoIcon from '@/shared/assets/icons/logo';
import { Avatar, Button, GlobalSearch } from '@/shared/components';
import { Header, HeaderActions, HeaderGroup } from '@/shared/components/header';
import {
  Sidebar,
  SidebarContent,
  SidebarCTA,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from '@/shared/components/sidebar';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-secondary grid max-h-dvh grid-cols-[minmax(290px,20.138%)_1fr] grid-rows-[max-content_1fr]'>
      <Sidebar className='row-span-2'>
        <SidebarHeader className='flex items-center'>
          <LogoIcon />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup aria-label='Main Navigation'>
            <SidebarItem
              icon='LayoutDashboard'
              label='Dashboard'
              to='/dashboard'
            />
            <SidebarItem
              icon='FileChartColumnIncreasing'
              label='New Request'
              to='/new-request'
            />
            <SidebarItem
              icon='ClockFading'
              label='Requests History'
              to='/history'
              disabled
            />
            <SidebarItem icon='Settings' label='Settings' to='settings' />
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
      <Header className='row-span-1 mx-10 mt-9'>
        <GlobalSearch
          size='medium'
          placeholder='Search patients or requests'
          disabled
        />

        <HeaderGroup separate>
          <HeaderActions>
            <Button variant='ghost' size='icon' disabled>
              <Settings className='text-status-info size-5' />
            </Button>
            <Button variant='ghost' size='icon' disabled>
              <BellDot className='text-status-destructive size-5' />
            </Button>
          </HeaderActions>
          <Avatar
            src='/images/mock_avatar.jpg'
            name='Dr. Kraude'
            role='Ambulance'
          />
        </HeaderGroup>
      </Header>
      <main className='max-h-dvh overflow-y-auto p-10'>{children}</main>
    </div>
  );
};
export default layout;
