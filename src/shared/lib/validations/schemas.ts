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
