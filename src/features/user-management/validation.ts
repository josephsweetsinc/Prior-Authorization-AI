import { z } from 'zod';

import {
  emailSchema,
  nameSchema,
  passwordSchema,
  surnameSchema,
} from '@/shared/lib/validations/schemas';

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

  email: emailSchema,

  role: z.enum(['provider', 'admin'], 'Role is required'),

  password: passwordSchema,
});

export const updateUserSchema = z.object({
  name: nameSchema,
  surname: surnameSchema,

  email: z
    .string()
    .min(1, 'Email is required')
    .refine(
      (value) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value),
      'Invalid email address',
    ),

  role: z.enum(['provider', 'admin'], 'Role is required'),
});
