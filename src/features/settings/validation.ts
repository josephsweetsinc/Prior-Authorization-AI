import { z } from 'zod';

import { passwordSchema, emailSchema } from '@/shared/lib/validations/schemas';

const updateOrganizationSchema = z.object({
  provider_type: z.string().nonempty({ message: 'Provider type is required' }),
  professional_id: z
    .string()
    .nonempty({ message: 'Professional ID is required' }),
  medic_name: z.string().nonempty({ message: 'Medic name is required' }),
});

const updatePasswordSchema = z
  .object({
    old_password: passwordSchema,
    new_password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((val, ctx) => {
    if (val.new_password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

const updateAccountSchema = z.object({
  name: z.string().nonempty({ message: 'First name is required' }),
  surname: z.string().nonempty({ message: 'Last name is required' }),
  email: emailSchema,
  phone: z
    .string()
    .min(7, { message: 'Phone is required' })
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => /^1\d{10}$/.test(v), {
      message: "Phone must be 11 digits starting with country code '1'",
    }),
  position: z.string().nonempty({ message: 'Position is required' }),
  place_of_work: z.string().nonempty({ message: 'Place of work is required' }),
});

type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;

export {
  updateOrganizationSchema,
  updatePasswordSchema,
  updateAccountSchema,
  type UpdateOrganizationSchema,
  type UpdatePasswordSchema,
  type UpdateAccountSchema,
};
