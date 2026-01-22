import { Download } from 'lucide-react';

import { TRANSPORTATION_TYPE_OPTIONS } from '@/features/new-request/constants';
import {
  type AmbulatoryStatus,
  type IRequestDetails,
  type TransportationType,
} from '@/services/requests';
import {
  Button,
  DateInput,
  Input,
  Select,
  SensitiveMessage,
  Separator,
  Window,
} from '@/shared/components';

import { AMBULATORY_STATUS_OPTIONS } from '../lib/constants';
import { type RequestDetailsFormState } from '../lib/types';
import { type RequestDetailsFormErrors } from '../lib/validation';

type Props = {
  data: IRequestDetails;
  form: RequestDetailsFormState;
  errors?: RequestDetailsFormErrors;
  onChange: (_next: Partial<RequestDetailsFormState>) => void;
  onSave: () => void;
  onDownload: () => void;
  isDownloading?: boolean;
  isSaving: boolean;
};

export const RequestDetailsContent = ({
  data,
  form,
  errors,
  onChange,
  onSave,
  onDownload,
  isDownloading = false,
  isSaving,
}: Props) => (
  <Window className='space-y-8'>
    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Patient Information</h2>
      <div className='grid gap-4 md:grid-cols-2'>
        <Input
          labelVariant='static'
          label='Patient Name'
          value={form.patientName}
          error={errors?.patientName}
          onChange={(event) => onChange({ patientName: event.target.value })}
        />
        <DateInput
          label='Date of Birth'
          value={form.patientDob || undefined}
          error={errors?.patientDob}
          onChangeAction={(value) => onChange({ patientDob: value ?? '' })}
        />
        <Input
          labelVariant='static'
          label='Medicare Number'
          value={form.patientId}
          error={errors?.patientId}
          onChange={(event) => onChange({ patientId: event.target.value })}
        />
        <Select
          options={AMBULATORY_STATUS_OPTIONS}
          label='Ambulatory Status'
          placeholder='Select status'
          value={form.ambulatoryStatus}
          error={errors?.ambulatoryStatus}
          onChange={(value) =>
            onChange({ ambulatoryStatus: value as AmbulatoryStatus })
          }
        />
      </div>
    </div>

    <Separator className='bg-gray-separator' />

    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Transport Details</h2>
      <Input
        labelVariant='static'
        label='Pickup Address'
        value={form.pickupAddress}
        error={errors?.pickupAddress}
        onChange={(event) => onChange({ pickupAddress: event.target.value })}
      />
      <Input
        labelVariant='static'
        label='Destination'
        value={form.destinationAddress}
        error={errors?.destinationAddress}
        onChange={(event) =>
          onChange({ destinationAddress: event.target.value })
        }
      />
      <div className='grid gap-4 md:grid-cols-2'>
        <DateInput
          label='Appointment Date'
          value={form.appointmentDate || undefined}
          error={errors?.appointmentDate}
          onChangeAction={(value) => onChange({ appointmentDate: value ?? '' })}
        />
        <Input
          type='time'
          labelVariant='static'
          label='Appointment Time'
          value={form.appointmentTime}
          className='h-11.25!'
          error={errors?.appointmentTime}
          onChange={(event) =>
            onChange({ appointmentTime: event.target.value })
          }
        />
        <Select
          options={TRANSPORTATION_TYPE_OPTIONS}
          label='Transport Type'
          placeholder='Select transport type'
          value={form.transportationType}
          error={errors?.transportationType}
          onChange={(value) =>
            onChange({ transportationType: value as TransportationType })
          }
        />
        <Select
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
          label='Oxygen Required'
          placeholder='Select option'
          value={
            form.oxygenRequired === true
              ? 'true'
              : form.oxygenRequired === false
                ? 'false'
                : ''
          }
          error={errors?.oxygenRequired}
          onChange={(value) => onChange({ oxygenRequired: value === 'true' })}
        />
      </div>
    </div>

    <Separator className='bg-gray-separator' />

    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Medical Information</h2>
      <Input
        labelVariant='static'
        label='Diagnosis'
        value={form.primaryDiagnosis}
        error={errors?.primaryDiagnosis}
        onChange={(event) => onChange({ primaryDiagnosis: event.target.value })}
      />
      <Input
        labelVariant='static'
        label='Medical Necessity'
        value={form.medicalJustification}
        error={errors?.medicalJustification}
        onChange={(event) =>
          onChange({ medicalJustification: event.target.value })
        }
      />
      <div className='grid gap-4 md:grid-cols-2'>
        <Input
          labelVariant='static'
          label='Ordering Physician'
          value={form.orderingPhysician}
          error={errors?.orderingPhysician}
          onChange={(event) =>
            onChange({ orderingPhysician: event.target.value })
          }
        />
        <Input
          labelVariant='static'
          label='Physician Phone'
          value={form.physicianPhone}
          error={errors?.physicianPhone}
          onChange={(event) => onChange({ physicianPhone: event.target.value })}
        />
      </div>
    </div>

    <SensitiveMessage
      variant='ai'
      title={`AI Confidence Score: ${data.ai_accuracy ?? 0}%`}
      description='This form was automatically populated by our AI engine. All fields have been verified against patient records and physician notes.'
    />
    <div className='flex w-auto justify-end gap-3'>
      <Button
        onClick={onDownload}
        disabled={isDownloading}
        className='w-auto rounded-xl px-10!'
        size='lg'
        variant='secondary'
      >
        Download PDF <Download color='#047CB4' />
      </Button>
      <Button
        variant='primary'
        className='w-auto rounded-xl'
        size='lg'
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  </Window>
);
