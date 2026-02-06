'use client';

import { useEffect, useMemo, useState } from 'react';

import { type FormState } from '@/features/new-request/info-form';
import { extractedToForm, type IExtractedData } from '@/services';
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

const FORM_NUMBER_PREFIX = 'CMS-';

const isValidFormNumber = (value: unknown) =>
  new RegExp(`^${FORM_NUMBER_PREFIX}\\d+$`).test(String(value ?? ''));

const isValidName = (value: unknown) =>
  new RegExp(`^[a-zA-Z]+$`).test(String(value ?? ''));

const REQUIRED_FIELDS: (keyof FormState)[] = [
  'transportationType',
  'patientFirstName',
  'patientLastName',
  'patientDob',
  'patientId',
  'dateOfTransport',
  'timeOfTransport',
  'pickupAddress',
  'destinationAddress',
  'primaryDiagnosis',
  'medicalJustification',
  'formNumber',
];

export function useInfoForm(initialValues?: Partial<IExtractedData> | null) {
  const [form, setForm] = useState<Partial<FormState>>(defaultValues);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    const newForm = extractedToForm(initialValues);

    const id = setTimeout(() => setForm(newForm!), 0);
    return () => clearTimeout(id);
  }, [initialValues]);

  const errors = useMemo(() => {
    const required = 'This field is required';

    return Object.fromEntries(
      Object.keys(FIELD_MAP).map((key) => {
        if (key === 'formNumber') {
          const value = form.formNumber;

          if (String(value ?? '').trim() === '') {
            return [key, required];
          }

          return [key, isValidFormNumber(value) ? '' : 'Use format CMS-12345'];
        }

        if (key === 'patientFirstName' || key === 'patientLastName') {
          const value = form[key as keyof typeof form];
          return [
            key,
            isValidName(value) ? '' : 'Name must contain only letters',
          ];
        }

        return [key, requiredIfEmpty(form[key as keyof typeof form], required)];
      }),
    );
  }, [form]);

  const isFormComplete = useMemo(() => {
    return REQUIRED_FIELDS.every((key) => {
      if (key === 'formNumber') {
        return isValidFormNumber(form.formNumber);
      }

      return String(form[key] ?? '').trim() !== '';
    });
  }, [form]);

  return { form, setForm, errors, isFormComplete };
}
