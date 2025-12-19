import { CreateNewPasswordForm } from '@/features/auth';

export function CreateNewPasswordView() {
  return (
    <div className='w-full space-y-8 px-10'>
      <div>
        <h1 className='text-brand-dark text-[40px] font-bold tracking-tight'>
          Create New Password
        </h1>
        <p className='text-gray-dark text-[18px]'>
          You’re almost there. Set your new password below.
        </p>
      </div>

      <CreateNewPasswordForm />
    </div>
  );
}
