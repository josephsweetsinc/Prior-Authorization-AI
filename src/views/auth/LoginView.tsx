import Link from 'next/link';

import { LoginForm } from '@/features/auth';

export function LoginView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div className=''>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Welcome Back
        </h1>
        <p className='text-gray-dark text-[18px]'>
          Please login to continue to your account.
        </p>
      </div>

      <LoginForm />

      <div className='text-gray-dark pt-3 text-center text-[18px]'>
        Need an account?{' '}
        <Link
          href='/sign-up'
          className='text-status-info font-semibold underline'
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
