import Link from 'next/link';

import { CompleteProfileForm } from '@/features/auth';
import ArrowDownIcon from '@/shared/assets/icons/arrow_down';

export function CompleteProfileView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <Link
        href='/sign-up'
        className='text-gray-dark flex items-center gap-1 pb-2.5'
      >
        <ArrowDownIcon className='rotate-90' />
        Back to Sign Up
      </Link>
      <div>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Complete Your Profile
        </h1>
        <p className='text-gray-dark text-[18px]'>
          Please provide additional information
        </p>
      </div>

      <CompleteProfileForm />

      <div className='text-gray-dark pt-3 text-center text-[18px]'>
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
