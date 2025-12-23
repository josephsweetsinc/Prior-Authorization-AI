import { MainHeader, MainSidebar } from '@/features/main';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-secondary grid max-h-dvh grid-cols-[minmax(290px,20.138%)_1fr] grid-rows-[max-content_1fr]'>
      <MainSidebar />
      <MainHeader />
      <main className='max-h-dvh overflow-y-auto p-10'>{children}</main>
    </div>
  );
};
export default layout;
