import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .refine(
      (value) => /^[A-Za-z\s]+$/.test(value),
      'Full name cannot contain numbers or special characters',
    )
    .refine(
      (value) => value.trim().split(/\s+/).length >= 2,
      'Please enter both first and last name',
    ),

  email: z
    .string()
    .min(1, 'Email is required')
    .refine(
      (value) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value),
      'Invalid email address',
    ),

  role: z.enum(['provider', 'admin'], 'Role is required'),

  password: z
    .string()
    .min(8, 'Password should be at least 8 characters long')
    .max(16, 'Password should be at most 16 characters long'),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'First name is required')
    .refine(
      (value) => /^[A-Za-z\s]+$/.test(value),
      'First name cannot contain numbers or special characters',
    ),
  surname: z
    .string()
    .min(1, 'Last name is required')
    .refine(
      (value) => /^[A-Za-z\s]+$/.test(value),
      'Last name cannot contain numbers or special characters',
    ),

  email: z
    .string()
    .min(1, 'Email is required')
    .refine(
      (value) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value),
      'Invalid email address',
    ),

  role: z.enum(['provider', 'admin'], 'Role is required'),
});
