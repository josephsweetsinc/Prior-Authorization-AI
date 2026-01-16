import { z } from 'zod';

import { phonePattern } from '@/shared/lib/validations/schemas';

import { type RequestDetailsFormState } from './types';

const PHONE_ERROR_MESSAGE = 'Phone can contain only digits, spaces, and ()+-';

export const requestDetailsSchema = z.object({
  patientName: z
    .string()
    .trim()
    .min(1, { message: 'Patient name is required' }),
  patientDob: z
    .string()
    .trim()
    .min(1, { message: 'Date of birth is required' }),
  patientId: z
    .string()
    .trim()
    .min(1, { message: 'Medicare number is required' }),
  ambulatoryStatus: z
    .string()
    .trim()
    .min(1, { message: 'Ambulatory status is required' }),
  pickupAddress: z
    .string()
    .trim()
    .min(1, { message: 'Pickup address is required' }),
  destinationAddress: z
    .string()
    .trim()
    .min(1, { message: 'Destination address is required' }),
  appointmentDate: z
    .string()
    .trim()
    .min(1, { message: 'Appointment date is required' }),
  appointmentTime: z
    .string()
    .trim()
    .min(1, { message: 'Appointment time is required' }),
  transportationType: z
    .string()
    .trim()
    .min(1, { message: 'Transport type is required' }),
  oxygenRequired: z
    .boolean()
    .optional()
    .refine((value) => value !== undefined, {
      message: 'Oxygen requirement is required',
    }),
  primaryDiagnosis: z
    .string()
    .trim()
    .min(1, { message: 'Diagnosis is required' }),
  medicalJustification: z
    .string()
    .trim()
    .min(1, { message: 'Medical necessity is required' }),
  orderingPhysician: z
    .string()
    .trim()
    .min(1, { message: 'Ordering physician is required' }),
  physicianPhone: z
    .string()
    .trim()
    .min(1, { message: 'Physician phone is required' })
    .refine((value) => phonePattern.test(value), {
      message: PHONE_ERROR_MESSAGE,
    }),
});

export type RequestDetailsFormErrors = Partial<
  Record<keyof RequestDetailsFormState, string>
>;

export const validateRequestDetailsForm = (
  formState: RequestDetailsFormState,
): { isValid: boolean; errors: RequestDetailsFormErrors } => {
  const result = requestDetailsSchema.safeParse(formState);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: RequestDetailsFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RequestDetailsFormState | undefined;
    if (!field || errors[field]) {
      continue;
    }
    errors[field] = issue.message;
  }

  return { isValid: false, errors };
};
