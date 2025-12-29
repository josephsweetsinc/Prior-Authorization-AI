'use client';

import { useEffect, useMemo, useState } from 'react';

import { type FormState } from '@/features/new-request/info-form';
import { extractedToForm } from '@/services';
import { FIELD_MAP } from '@/services/new-request/constants';

const defaultValues: FormState = {
  transportationType: '',
  patientFirstName: '',
  patientLastName: '',
  patientDob: '',
  patientId: '',
  dateOfTransport: '',
  timeOfTransport: '',
  pickupAddress: '',
  destinationAddress: '',
  primaryDiagnosis: '',
  medicalJustification: '',
  formNumber: '',
};

const requiredIfEmpty = (value: unknown, message: string) =>
  String(value ?? '').trim() === '' ? message : '';

export function useInfoForm(initialValues?: Record<string, unknown> | null) {
  const [form, setForm] = useState<FormState>(defaultValues);

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    const v = initialValues as Record<string, unknown>;

    const newForm = extractedToForm(v);

    const id = setTimeout(() => setForm(newForm!), 0);
    return () => clearTimeout(id);
  }, [initialValues]);

  const errors = useMemo(() => {
    const required = 'This field is required';

    return Object.fromEntries(
      Object.keys(FIELD_MAP).map((key) => [
        key,
        requiredIfEmpty(form[key as keyof typeof form], required),
      ]),
    );
  }, [form]);

  const isFormComplete = useMemo(() => {
    return Object.values(form).every(
      (value) => String(value ?? '').trim() !== '',
    );
  }, [form]);

  return { form, setForm, errors, isFormComplete };
}
