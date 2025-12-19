import Link from 'next/link';

import { ForgotPasswordForm } from '@/features/auth';
import ArrowDownIcon from '@/shared/assets/icons/arrow_down';

export function ForgotPasswordView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <Link
        href='/login'
        className='text-gray-dark flex items-center gap-1 pb-2.5'
      >
        <ArrowDownIcon className='rotate-90' />
        Back
      </Link>
      <div>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Reset your password
        </h1>
        <p className='text-gray-dark text-[18px]'>
          Enter the email address associated with your account and we’ll send
          you a link to reset your password.
        </p>
      </div>

      <ForgotPasswordForm />

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
