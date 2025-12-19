import { z } from 'zod';

const passwordPattern = /^[A-Za-z0-9!@#$%^&*]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .refine((val) => emailPattern.test(val), {
    message: 'Invalid email address',
  });
export type Email = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .refine((val) => passwordPattern.test(val), {
    message:
      'Password must contain only Latin letters, digits and the symbols ! @ # $ % ^ & *',
  });
export type Password = z.infer<typeof passwordSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  keepLoggedIn: z.boolean().optional().default(false),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
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

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const createNewPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    token: z.string().optional(),
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
export type CreateNewPasswordSchema = z.infer<typeof createNewPasswordSchema>;

// Complete profile schema
const phonePattern = /^[0-9()+\-\s]{7,20}$/;
export const completeProfileSchema = z.object({
  phone: z
    .string()
    .min(7, { message: 'Phone is required' })
    .refine((v) => phonePattern.test(v), { message: 'Invalid phone number' }),
  company: z.string().min(1, { message: 'Company is required' }),
  jobTitle: z.string().min(1, { message: 'Position is required' }),
});
export type CompleteProfileSchema = z.infer<typeof completeProfileSchema>;
