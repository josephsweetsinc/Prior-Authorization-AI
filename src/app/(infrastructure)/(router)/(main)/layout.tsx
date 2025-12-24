import { AppHeader, AppSidebar, Container } from '@/views/layout';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <div className='bg-secondary grid max-h-dvh grid-cols-[minmax(290px,20.138%)_1fr] grid-rows-[max-content_1fr]'>
        <AppSidebar />
        <AppHeader />
        <main className='max-h-dvh overflow-y-auto p-10'>{children}</main>
      </div>
    </Container>
  );
};
export default layout;
