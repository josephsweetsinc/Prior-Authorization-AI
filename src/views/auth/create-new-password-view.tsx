import { CreateNewPasswordForm } from '@/features/auth/create-new-password/create-new-password-form';

export function CreateNewPasswordView() {
  return (
    <div className='w-full space-y-8 px-10'>
      <div>
        <h1 className='text-[40px] font-bold tracking-tight text-[#193782]'>
          Create New Password
        </h1>
        <p className='text-[18px] text-[#4A5568]'>
          You’re almost there. Set your new password below.
        </p>
      </div>

      <CreateNewPasswordForm />
    </div>
  );
}
