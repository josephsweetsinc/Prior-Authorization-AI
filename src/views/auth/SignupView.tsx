import Link from 'next/link';

import { SignUpForm } from '@/features/auth';

export function SignupView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Sign Up
        </h1>
        <p className='text-gray-dark text-[18px]'>Create your account</p>
      </div>

      <SignUpForm />

      <div className='text-gray-dark text-center text-[18px]'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='text-status-info font-semibold underline'
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
