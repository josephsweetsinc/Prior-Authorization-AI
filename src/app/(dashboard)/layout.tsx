import LogoIcon from '@/shared/assets/icons/logo';
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
    <div className='flex items-stretch'>
      <Sidebar>
        <SidebarHeader className='flex items-center'>
          <LogoIcon />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup aria-label='Main Navigation'>
            <SidebarItem label='Dashboard' to='/dashboard' />
            <SidebarItem label='New Request' to='/new-request' />
            <SidebarItem label='Requests History' to='/history' />
            <SidebarItem label='Settings' to='settings' />
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarCTA
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
      <main className='max-h-dvh flex-1 overflow-y-auto bg-[#F5F7FA]'>
        {children}
      </main>
      ;
    </div>
  );
};
export default layout;
