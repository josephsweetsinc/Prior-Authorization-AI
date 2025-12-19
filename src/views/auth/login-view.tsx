import Link from 'next/link';

import { LoginForm } from '@/features/auth/login/login-form';

export function LoginView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div className=''>
        <h1 className='text-[40px] font-bold tracking-tight text-[#193782]'>
          Welcome Back
        </h1>
        <p className='text-[18px] text-[#4A5568]'>
          Please login to continue to your account.
        </p>
      </div>

      <LoginForm />

      <div className='pt-3 text-center text-[18px] text-[#4A5568]'>
        Need an account?{' '}
        <Link
          href='/sign-up'
          className='font-semibold text-[#047CB4] underline'
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
