import Link from 'next/link';

import { CompleteProfileForm } from '@/features/auth/complete-profile/complete-profile-form';

export function CompleteProfileView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div>
        <h1 className='text-[40px] font-bold tracking-tight text-[#193782]'>
          Complete Your Profile
        </h1>
        <p className='text-[18px] text-[#4A5568]'>
          Please provide additional information
        </p>
      </div>

      <CompleteProfileForm />

      <div className='pt-3 text-center text-[18px] text-[#4A5568]'>
        Already have an account?{' '}
        <Link href='/login' className='font-semibold text-[#047CB4] underline'>
          Log In
        </Link>
      </div>
    </div>
  );
}
