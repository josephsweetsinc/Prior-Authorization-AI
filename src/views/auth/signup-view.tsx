import Link from 'next/link';

import { SignUpForm } from '@/features/auth/signup/signup-form';

export function SignUpView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div>
        <h1 className='text-[40px] font-bold tracking-tight text-[#193782]'>
          Sign Up
        </h1>
        <p className='text-[18px] text-[#4A5568]'>Create your account</p>
      </div>

      <SignUpForm />

      <div className='pt-3 text-center text-[18px] text-[#4A5568]'>
        Already have an account?{' '}
        <Link href='/login' className='font-semibold text-[#047CB4] underline'>
          Log In
        </Link>
      </div>
    </div>
  );
}
