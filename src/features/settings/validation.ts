import { z } from 'zod';

import { passwordSchema } from '@/shared/lib/validations/schemas';

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

type UpdateOrganizationSchema = z.infer<typeof updateOrganizationSchema>;
type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export {
  updateOrganizationSchema,
  updatePasswordSchema,
  type UpdateOrganizationSchema,
  type UpdatePasswordSchema,
};
