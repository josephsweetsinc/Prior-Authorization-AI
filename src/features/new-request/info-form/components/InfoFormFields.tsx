import React from 'react';

import { type FormState } from '@/features/new-request/info-form';
import { Input, DateInput } from '@/shared/components';

type Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
};

export const InfoFormFields = ({ form, setForm, errors }: Props) => {
  return (
    <div className='space-y-5'>
      <Input
        label='Transportation Type'
        labelVariant='static'
        value={form.transportationType}
        onChange={(e) =>
          setForm((p) => ({ ...p, transportationType: e.target.value }))
        }
        error={errors.transportationType}
      />

      <div className='flex w-full justify-between gap-5'>
        <Input
          label='Patient First Name'
          labelVariant='static'
          value={form.patientFirstName}
          onChange={(e) =>
            setForm((p) => ({ ...p, patientFirstName: e.target.value }))
          }
          error={errors.patientFirstName}
        />
        <Input
          label='Patient Last Name'
          labelVariant='static'
          value={form.patientLastName}
          onChange={(e) =>
            setForm((p) => ({ ...p, patientLastName: e.target.value }))
          }
          error={errors.patientLastName}
        />
      </div>

      <div className='flex w-full justify-between gap-5'>
        <DateInput
          label='Date of Birth'
          value={form.patientDob || undefined}
          onChangeAction={(v) =>
            setForm((p) => ({ ...p, patientDob: v ?? '' }))
          }
          error={errors.patientDob}
        />
        <Input
          label='Patient ID'
          labelVariant='static'
          value={form.patientId}
          onChange={(e) =>
            setForm((p) => ({ ...p, patientId: e.target.value }))
          }
          error={errors.patientId}
        />
      </div>

      <div className='flex w-full justify-between gap-5'>
        <DateInput
          label='Date of Transport'
          value={form.dateOfTransport || undefined}
          onChangeAction={(v) =>
            setForm((p) => ({ ...p, dateOfTransport: v ?? '' }))
          }
          error={errors.dateOfTransport}
        />
        <Input
          label='Time of Transport'
          labelVariant='static'
          value={form.timeOfTransport}
          onChange={(e) =>
            setForm((p) => ({ ...p, timeOfTransport: e.target.value }))
          }
          error={errors.timeOfTransport}
        />
      </div>

      <div className='flex w-full justify-between gap-5'>
        <Input
          label='Pickup Address'
          labelVariant='static'
          value={form.pickupAddress}
          onChange={(e) =>
            setForm((p) => ({ ...p, pickupAddress: e.target.value }))
          }
          error={errors.pickupAddress}
        />

        <Input
          label='Destination Address'
          labelVariant='static'
          value={form.destinationAddress}
          onChange={(e) =>
            setForm((p) => ({ ...p, destinationAddress: e.target.value }))
          }
          error={errors.destinationAddress}
        />
      </div>

      <Input
        label='Primary Diagnosis'
        labelVariant='static'
        value={form.primaryDiagnosis}
        onChange={(e) =>
          setForm((p) => ({ ...p, primaryDiagnosis: e.target.value }))
        }
        error={errors.primaryDiagnosis}
      />

      <Input
        label='Medical Justification'
        labelVariant='static'
        value={form.medicalJustification}
        onChange={(e) =>
          setForm((p) => ({ ...p, medicalJustification: e.target.value }))
        }
        error={errors.medicalJustification}
      />
    </div>
  );
};
