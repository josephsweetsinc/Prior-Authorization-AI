import { MainLayoutShell } from '@/views/layout/MainLayoutShell';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayoutShell>{children}</MainLayoutShell>;
};
export default Layout;
