import { WebSocketInitializer } from '@/features/websocket';
import { AppHeader, AppSidebar } from '@/views/layout';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-secondary grid max-h-dvh grid-cols-[minmax(290px,20.138%)_1fr] grid-rows-[max-content_1fr]'>
      <WebSocketInitializer />
      <AppSidebar />
      <AppHeader />
      <main className='max-h-dvh overflow-y-auto p-10'>{children}</main>
    </div>
  );
};
export default layout;
