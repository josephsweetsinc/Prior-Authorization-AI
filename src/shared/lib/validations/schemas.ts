import { z } from 'zod';

const passwordPattern = /^[A-Za-z0-9!@#$%^&*]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email is required' })
  .max(254, { message: 'Email must be 254 characters or less' })
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

export const phonePattern = /^[0-9()+\-\s]{7,20}$/;

export const nameSchema = z
  .string()
  .trim()
  .min(3, { message: 'Name must be between 3 and 15 letters' })
  .max(15, { message: 'Name must be between 3 and 15 letters' })
  .regex(/^\p{L}+$/u, { message: 'Name must contain only letters' });
export type Name = z.infer<typeof nameSchema>;

export const surnameSchema = nameSchema;
export type Surname = z.infer<typeof surnameSchema>;
