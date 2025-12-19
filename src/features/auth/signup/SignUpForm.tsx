'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';

import { GoogleIcon } from '@/shared/assets/icons';
import { Checkbox } from '@/shared/components';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import { signupSchema, type SignUpSchema } from '@/shared/lib/validations/auth';

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignUpSchema>,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      keepLoggedIn: false,
    },
  });

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    setIsLoading(true);
    console.warn(data);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/sign-up/complete-profile');
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <Input
        label='Email'
        type='email'
        {...register('email')}
        error={errors.email?.message}
      />

      <div className='flex gap-5'>
        <Input
          label='First name'
          type='text'
          {...register('firstName')}
          error={errors.firstName?.message}
        />

        <Input
          label='Last name'
          type='text'
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label='Password'
        type='password'
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        label='Confirm password'
        type='password'
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <div className='flex items-center space-x-2'>
        <Checkbox label='Keep me logged in' {...register('keepLoggedIn')} />
      </div>

      {errors.root && (
        <div className='text-destructive text-sm'>{errors.root.message}</div>
      )}

      <div className='space-y-5'>
        <div className='pt-4'>
          <Button variant='primary' size='default' disabled={isLoading}>
            {isLoading ? 'Sign Up' : 'Sign Up'}
          </Button>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-[#E8E8E8]' />
          </div>
          <div className='text-md relative flex justify-center font-medium'>
            <span className='bg-white px-2.5 text-[#4A5568]'>or</span>
          </div>
        </div>

        <Button variant='default' size='default'>
          Sign Up with Google
          <GoogleIcon />
        </Button>
      </div>
    </form>
  );
}
