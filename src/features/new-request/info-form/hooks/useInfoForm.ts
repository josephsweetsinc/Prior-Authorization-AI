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

const isValidName = (value: unknown) => {
  const str = String(value ?? '');
  return /^[a-zA-Z]+$/.test(str) && str.length >= 3 && str.length <= 15;
};

const getNameError = (value: unknown): string => {
  const str = String(value ?? '');
  if (str.trim() === '') {
    return 'This field is required';
  }
  if (!/^[a-zA-Z]+$/.test(str)) {
    return 'Name must contain only letters';
  }
  if (str.length < 3) {
    return 'Name must be at least 3 characters';
  }
  if (str.length > 15) {
    return 'Name must be at most 15 characters';
  }
  return '';
};

const isValidAddress = (value: unknown) => {
  const len = String(value ?? '').length;
  return len >= 5 && len <= 500;
};

const getAddressError = (value: unknown): string => {
  const len = String(value ?? '').length;
  if (len === 0) {
    return 'This field is required';
  }
  if (len < 5) {
    return 'Address must be at least 5 characters';
  }
  if (len > 500) {
    return 'Address must be at most 500 characters';
  }
  return '';
};

const isValidPatientId = (value: unknown) => {
  const len = String(value ?? '').trim().length;
  return len >= 1 && len <= 50;
};

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
            return [key, ''];
          }
          return [key, isValidFormNumber(value) ? '' : 'Use format CMS-12345'];
        }

        if (key === 'patientFirstName' || key === 'patientLastName') {
          const value = form[key as keyof typeof form];
          return [key, getNameError(value)];
        }

        if (key === 'pickupAddress' || key === 'destinationAddress') {
          const value = form[key as keyof typeof form];
          return [key, getAddressError(value)];
        }

        if (key === 'patientId') {
          const value = form.patientId;
          if (String(value ?? '').trim() === '') {
            return [key, required];
          }
          if (String(value ?? '').length > 50) {
            return [key, 'ID must be at most 50 characters'];
          }
          return [key, ''];
        }

        if (key === 'primaryDiagnosis' || key === 'medicalJustification') {
          return [key, ''];
        }

        return [key, requiredIfEmpty(form[key as keyof typeof form], required)];
      }),
    );
  }, [form]);

  const isFormComplete = useMemo(() => {
    const formNumberValue = String(form.formNumber ?? '').trim();
    if (formNumberValue !== '' && !isValidFormNumber(formNumberValue)) {
      return false;
    }

    return REQUIRED_FIELDS.every((key) => {
      if (key === 'patientFirstName' || key === 'patientLastName') {
        return isValidName(form[key as keyof typeof form]);
      }
      if (key === 'pickupAddress' || key === 'destinationAddress') {
        return isValidAddress(form[key as keyof typeof form]);
      }
      if (key === 'patientId') {
        return isValidPatientId(form.patientId);
      }
      return String(form[key] ?? '').trim() !== '';
    });
  }, [form]);

  return { form, setForm, errors, isFormComplete };
}
