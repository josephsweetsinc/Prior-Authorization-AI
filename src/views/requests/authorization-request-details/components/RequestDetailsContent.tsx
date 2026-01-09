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

type Props = {
  data: IRequestDetails;
  form: RequestDetailsFormState;
  onChange: (_next: Partial<RequestDetailsFormState>) => void;
  onSave: () => void;
  isSaving: boolean;
};

export const RequestDetailsContent = ({
  data,
  form,
  onChange,
  onSave,
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
          onChange={(event) => onChange({ patientName: event.target.value })}
        />
        <DateInput
          label='Date of Birth'
          value={form.patientDob || undefined}
          onChangeAction={(value) => onChange({ patientDob: value ?? '' })}
        />
        <Input
          labelVariant='static'
          label='Medicare Number'
          value={form.patientId}
          onChange={(event) => onChange({ patientId: event.target.value })}
        />
        <Select
          options={AMBULATORY_STATUS_OPTIONS}
          label='Ambulatory Status'
          placeholder='Select status'
          value={form.ambulatoryStatus}
          onChange={(value) =>
            onChange({ ambulatoryStatus: value as AmbulatoryStatus })
          }
        />
      </div>
    </div>

    <Separator className='bg-gray-200' />

    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Transport Details</h2>
      <Input
        labelVariant='static'
        label='Pickup Address'
        value={form.pickupAddress}
        onChange={(event) => onChange({ pickupAddress: event.target.value })}
      />
      <Input
        labelVariant='static'
        label='Destination'
        value={form.destinationAddress}
        onChange={(event) =>
          onChange({ destinationAddress: event.target.value })
        }
      />
      <div className='grid gap-4 md:grid-cols-2'>
        <DateInput
          label='Appointment Date'
          value={form.appointmentDate || undefined}
          onChangeAction={(value) => onChange({ appointmentDate: value ?? '' })}
        />
        <Input
          type='time'
          labelVariant='static'
          label='Appointment Time'
          value={form.appointmentTime}
          className='!h-[45px]'
          onChange={(event) =>
            onChange({ appointmentTime: event.target.value })
          }
        />
        <Select
          options={TRANSPORTATION_TYPE_OPTIONS}
          label='Transport Type'
          placeholder='Select transport type'
          value={form.transportationType}
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
          onChange={(value) => onChange({ oxygenRequired: value === 'true' })}
        />
      </div>
    </div>

    <Separator className='bg-gray-200' />

    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Medical Information</h2>
      <Input
        labelVariant='static'
        label='Diagnosis'
        value={form.primaryDiagnosis}
        onChange={(event) => onChange({ primaryDiagnosis: event.target.value })}
      />
      <Input
        labelVariant='static'
        label='Medical Necessity'
        value={form.medicalJustification}
        onChange={(event) =>
          onChange({ medicalJustification: event.target.value })
        }
      />
      <div className='grid gap-4 md:grid-cols-2'>
        <Input
          labelVariant='static'
          label='Ordering Physician'
          value={form.orderingPhysician}
          onChange={(event) =>
            onChange({ orderingPhysician: event.target.value })
          }
        />
        <Input
          labelVariant='static'
          label='Physician Phone'
          value={form.physicianPhone}
          onChange={(event) => onChange({ physicianPhone: event.target.value })}
        />
      </div>
    </div>

    <SensitiveMessage
      variant='ai'
      title={`AI Confidence Score: ${data.ai_accuracy ?? 0}%`}
      description='This form was automatically populated by our AI engine. All fields have been verified against patient records and physician notes.'
    />
    <div className='flex w-auto justify-end'>
      <Button
        variant='primary'
        className='w-auto rounded-3xl'
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  </Window>
);
