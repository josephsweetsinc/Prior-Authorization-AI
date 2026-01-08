import { type IRequestDetails } from '@/services/requests-history';
import {
  Input,
  SensitiveMessage,
  Separator,
  Window,
} from '@/shared/components';

import { displayValue } from './utils';

type Props = {
  data: IRequestDetails;
  patientDob: string;
  appointmentDate: string;
  appointmentTime: string;
};

export const RequestDetailsContent = ({
  data,
  patientDob,
  appointmentDate,
  appointmentTime,
}: Props) => (
  <Window className='space-y-8'>
    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Patient Information</h2>
      <div className='grid gap-4 md:grid-cols-2'>
        <Input
          labelVariant='static'
          label='Patient Name'
          defaultValue={displayValue(
            `${data.patient_first_name} ${data.patient_last_name}`.trim(),
          )}
          disabled
        />
        <Input
          labelVariant='static'
          label='Date of Birth'
          defaultValue={patientDob}
          disabled
        />
        <Input
          labelVariant='static'
          label='Medicare Number'
          defaultValue={displayValue(data.patient_id)}
          disabled
        />
        <Input
          labelVariant='static'
          label='Ambulatory Status'
          defaultValue={displayValue(data.ambulatory_status)}
          className='capitalize'
          disabled
        />
      </div>
    </div>

    <Separator className='bg-gray-200' />

    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Transport Details</h2>
      <Input
        labelVariant='static'
        label='Pickup Address'
        defaultValue={displayValue(data.pickup_address)}
        disabled
      />
      <Input
        labelVariant='static'
        label='Destination'
        defaultValue={displayValue(data.destination_address)}
        disabled
      />
      <div className='grid gap-4 md:grid-cols-2'>
        <Input
          labelVariant='static'
          label='Appointment Date'
          defaultValue={appointmentDate}
          disabled
        />
        <Input
          labelVariant='static'
          label='Appointment Time'
          defaultValue={appointmentTime}
          disabled
        />
        <Input
          labelVariant='static'
          label='Transport Type'
          defaultValue={displayValue(data.transportation_type)}
          className='capitalize'
          disabled
        />
        <Input
          labelVariant='static'
          label='Oxygen Required'
          defaultValue={
            data.oxygen_required === true
              ? 'Yes'
              : data.oxygen_required === false
                ? 'No'
                : 'Not provided'
          }
          disabled
        />
      </div>
    </div>

    <Separator className='bg-gray-200' />

    <div className='space-y-5'>
      <h2 className='text-brand-dark text-lg font-bold'>Medical Information</h2>
      <Input
        labelVariant='static'
        label='Diagnosis'
        defaultValue={displayValue(data.primary_diagnosis)}
        disabled
      />
      <Input
        labelVariant='static'
        label='Medical Necessity'
        defaultValue={displayValue(data.medical_justification)}
        disabled
      />
      <div className='grid gap-4 md:grid-cols-2'>
        <Input
          labelVariant='static'
          label='Ordering Physician'
          defaultValue={displayValue(data.ordering_physician)}
          disabled
        />
        <Input
          labelVariant='static'
          label='Physician Phone'
          defaultValue={displayValue(data.physician_phone)}
          disabled
        />
      </div>
    </div>

    <SensitiveMessage
      variant='ai'
      title={`AI Confidence Score: ${data.ai_accuracy ?? 0}%`}
      description='This form was automatically populated by our AI engine. All fields have been verified against patient records and physician notes.'
    />
  </Window>
);
