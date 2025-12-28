import { useEffect, useMemo, useState } from 'react';

import { type FormState } from '@/features/new-request/info-form';

const emptyForm: FormState = {
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

export function useInfoForm(initialValues?: Record<string, unknown> | null) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!initialValues) {
      return;
    }
    const v = initialValues as Record<string, unknown>;

    const newForm: FormState = {
      transportationType: (v.transportation_type as string) ?? '',
      patientFirstName: (v.patient_first_name as string) ?? '',
      patientLastName: (v.patient_last_name as string) ?? '',
      patientDob: (v.patient_date_of_birth as string) ?? '',
      patientId: (v.patient_id as string) ?? '',
      dateOfTransport: (v.date_of_transport as string) ?? '',
      timeOfTransport: (v.time_of_transport as string) ?? '',
      pickupAddress: (v.pickup_address as string) ?? '',
      destinationAddress: (v.destination_address as string) ?? '',
      primaryDiagnosis: (v.primary_diagnosis as string) ?? '',
      medicalJustification: (v.medical_justification as string) ?? '',
      formNumber: (v.form_number as string) ?? '',
    };

    const id = setTimeout(() => setForm(newForm), 0);
    return () => clearTimeout(id);
  }, [initialValues]);

  const errors = useMemo(() => {
    const required = 'This field is required';
    return {
      transportationType:
        String(form.transportationType ?? '').trim() === '' ? required : '',
      patientFirstName:
        String(form.patientFirstName ?? '').trim() === '' ? required : '',
      patientLastName:
        String(form.patientLastName ?? '').trim() === '' ? required : '',
      patientDob: String(form.patientDob ?? '').trim() === '' ? required : '',
      patientId: String(form.patientId ?? '').trim() === '' ? required : '',
      dateOfTransport:
        String(form.dateOfTransport ?? '').trim() === '' ? required : '',
      timeOfTransport:
        String(form.timeOfTransport ?? '').trim() === '' ? required : '',
      pickupAddress:
        String(form.pickupAddress ?? '').trim() === '' ? required : '',
      destinationAddress:
        String(form.destinationAddress ?? '').trim() === '' ? required : '',
      primaryDiagnosis:
        String(form.primaryDiagnosis ?? '').trim() === '' ? required : '',
      medicalJustification:
        String(form.medicalJustification ?? '').trim() === '' ? required : '',
      formNumber: String(form.formNumber ?? '').trim() === '' ? required : '',
    } as Record<string, string>;
  }, [form]);

  const isFormComplete = useMemo(() => {
    return Object.values(form).every((v) => String(v ?? '').trim() !== '');
  }, [form]);

  return { form, setForm, errors, isFormComplete };
}
