import Image from 'next/image';

import LogoIcon from '@/shared/assets/icons/logo';
import { Container } from '@/views/layout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className='flex min-h-screen w-full font-sans text-slate-900'>
        <div className='flex w-full flex-col justify-between bg-white px-8 py-8'>
          <div className='flex items-center gap-2'>
            <LogoIcon />
          </div>

          <div className='flex flex-1 flex-col justify-center'>{children}</div>
        </div>

        <div className='relative m-3 w-[90%] bg-white lg:block'>
          <Image
            src='/images/auth_bg.webp'
            alt='Abstract background'
            fill
            className='rounded-[24px] object-cover'
            priority
          />
        </div>
      </div>
    </Container>
  );
}
