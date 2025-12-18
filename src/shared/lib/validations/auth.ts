import { z } from 'zod';

const passwordPattern = /^[A-Za-z0-9!@#$%^&*]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .refine((val) => emailPattern.test(val), {
      message: 'Invalid email address',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => passwordPattern.test(val), {
      message:
        'Password must contain only Latin letters, digits and the symbols ! @ # $ % ^ & *',
    }),
  keepLoggedIn: z.boolean().optional().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .refine((val) => emailPattern.test(val), {
        message: 'Invalid email address',
      }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine((val) => passwordPattern.test(val), {
        message:
          'Password must contain only Latin letters, digits and the symbols ! @ # $ % ^ & *',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
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
