'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { z } from 'zod';

import { useLogin } from '@/services/auth/hooks/useLogin';
import { GoogleIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox/checkbox';
import { Input } from '@/shared/components/inputs';
import { useApiFormError } from '@/shared/hooks/useApiFormError';
import { emailSchema, passwordSchema } from '@/shared/lib/validations/schemas';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  keepLoggedIn: z.boolean().optional().default(false),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginSchema>,
    defaultValues: {
      email: '',
      password: '',
      keepLoggedIn: false,
    },
  });

  const { handleError } = useApiFormError(setError);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      await login(
        { username: data.email, password: data.password },
        data.keepLoggedIn,
      );

      router.push('/');
    } catch (err: unknown) {
      handleError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='space-y-1'>
        <Input
          label='Email'
          type='email'
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className='relative space-y-1'>
        <Input
          label='Password'
          type='password'
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <div className='flex items-center justify-between pt-5'>
        <div className='flex items-center space-x-2'>
          <Checkbox label='Keep me logged in' {...register('keepLoggedIn')} />
        </div>

        <div className='-mt-10'>
          <Link
            href='/forgot-password'
            className='text-sm text-[#047CB4] hover:underline'
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div className='space-y-5'>
        <Button variant='primary' size='default' disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-[#E8E8E8]' />
          </div>
          <div className='text-md relative flex justify-center font-medium'>
            <span className='text-gray-dark bg-white px-2.5'>or</span>
          </div>
        </div>

        <Button variant='default' size='default' type='button'>
          Sign in with Google
          <GoogleIcon />
        </Button>
      </div>
    </form>
  );
}
