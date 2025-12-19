import { ForgotPasswordForm } from '@/features/auth/forgot-password/forgot-password-form';

export function ForgotPasswordView() {
  return (
    <div className='w-full space-y-5 px-10'>
      <div>
        <h1 className='text-[40px] font-bold tracking-tight text-[#193782]'>
          Reset your password
        </h1>
        <p className='text-[18px] text-[#4A5568]'>
          Enter the email address associated with your account and we’ll send
          you a link to reset your password.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}
