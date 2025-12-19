import { EnterCodeForm } from '@/features/auth';
import Link from 'next/link';
import ArrowDownIcon from '@/shared/assets/icons/arrow_down';

export function EnterCodeView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <Link
        href='/forgot-password'
        className='text-gray-dark flex items-center gap-1 pb-2.5'
      >
        <ArrowDownIcon className='rotate-90' />
        Back
      </Link>
      <div>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Enter Code
        </h1>
        <p className='text-gray-dark text-[18px]'>
          Check your inbox and enter the 5-digit code we just sent to your email
          address.
        </p>
      </div>

      <EnterCodeForm />
    </div>
  );
}
