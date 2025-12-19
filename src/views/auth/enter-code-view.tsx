import { EnterCodeForm } from '@/features/auth/forgot-password/enter-code-form';

export function EnterCodeView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div>
        <h1 className='text-[40px] font-bold tracking-tight text-[#193782]'>
          Enter Code
        </h1>
        <p className='text-[18px] text-[#4A5568]'>
          Check your inbox and enter the 5-digit code we just sent to your email
          address.
        </p>
      </div>

      <EnterCodeForm />
    </div>
  );
}
