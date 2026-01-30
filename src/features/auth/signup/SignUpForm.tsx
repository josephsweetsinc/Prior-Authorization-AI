'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Checkbox } from '@/shared/components';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/inputs';
import {
  emailSchema,
  passwordSchema,
  nameSchema,
  surnameSchema,
} from '@/shared/lib/validations/schemas';

export const signupSchema = z
  .object({
    name: nameSchema,
    surname: surnameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    keepLoggedIn: z.boolean().optional().default(false),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });
export type SignUpSchema = z.infer<typeof signupSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignUpSchema>,
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      keepLoggedIn: false,
    },
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const rehydrate = () => {
      const saved = sessionStorage.getItem('signup_step1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          reset({
            name: parsed.name ?? '',
            surname: parsed.surname ?? '',
            email: parsed.email ?? '',
            password: parsed.password ?? '',
            confirmPassword: parsed.password ?? '',
            keepLoggedIn: parsed.keepLoggedIn ?? false,
          });
        } catch {}
      }
    };

    rehydrate();

    window.addEventListener('pageshow', rehydrate);

    const subscription = watch((values) => {
      try {
        const toSave = {
          name: values.name ?? '',
          surname: values.surname ?? '',
          email: values.email ?? '',
          password: values.password ?? '',
          keepLoggedIn: (values.keepLoggedIn as boolean) ?? false,
        };
        sessionStorage.setItem('signup_step1', JSON.stringify(toSave));
      } catch {}
    });

    return () => {
      subscription.unsubscribe?.();
      window.removeEventListener('pageshow', rehydrate);
    };
  }, [reset, watch]);

  const onInvalid = (errs: Record<string, unknown>) => {
    const extractMessage = (obj: unknown): string | undefined => {
      if (obj === null || obj === undefined) {
        return undefined;
      }

      if (typeof obj === 'object') {
        const record = obj as Record<string, unknown>;

        if ('message' in record && typeof record.message === 'string') {
          return record.message;
        }

        if ('root' in record && typeof record.root === 'object') {
          const root = record.root as Record<string, unknown>;
          if ('message' in root && typeof root.message === 'string') {
            return root.message;
          }
        }

        for (const key of Object.keys(record)) {
          const nested = extractMessage(record[key]);
          if (nested) {
            return nested;
          }
        }
      }

      return undefined;
    };

    const msg = extractMessage(errs) ?? 'Please check the form for errors.';
    toast.error(msg);
  };

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    setIsLoading(true);
    try {
      const step1 = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
      };
      sessionStorage.setItem('signup_step1', JSON.stringify(step1));
      router.push('/sign-up/complete-profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='space-y-5'>
      <Input
        label='Email'
        type='email'
        maxLength={254}
        {...register('email')}
        error={errors.email?.message}
      />

      <div className='flex gap-5'>
        <Input
          label='First name'
          type='text'
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label='Last name'
          type='text'
          {...register('surname')}
          error={errors.surname?.message}
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
            {isLoading ? 'Signing...' : 'Sign Up'}
          </Button>
        </div>
      </div>
    </form>
  );
}
