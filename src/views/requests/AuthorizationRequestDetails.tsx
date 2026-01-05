import { CircleX, CircleCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import {
  Button,
  Chip,
  Input,
  SensitiveMessage,
  Separator,
  StatusTimeline,
  TitleAndDesc,
  Window,
} from '@/shared/components';

type Props = {
  requestId: string;
};

const AuthorizationRequestDetails = ({ requestId }: Props) => {
  return (
    <main className='space-y-6'>
      <section className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-4'>
          <Link
            href='/requests'
            className='flex items-center text-sm text-[#4A5568]'
          >
            <ChevronLeft
              color='#4A5568'
              strokeWidth={1.25}
              width={16}
              height={16}
            />{' '}
            Back to Request
          </Link>
          <TitleAndDesc
            title={`Request ${requestId}`}
            subtitle='CMS-10344 Medical Transportation Authorization Form'
            titleClassName='text-2xl md:text-3xl'
            subtitleClassName='text-base'
          />
        </div>
        <Chip
          variant='warning'
          label='Pending Review'
          className='self-end px-4 py-2.5 text-[16px]'
        />
      </section>

      <section className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <Window className='space-y-8'>
          <div className='space-y-5'>
            <h2 className='text-brand-dark text-lg font-bold'>
              Patient Information
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              <Input
                labelVariant='static'
                label='Patient Name'
                defaultValue='Sarah Johnson'
                disabled
              />
              <Input
                labelVariant='static'
                label='Date of Birth'
                defaultValue='03-15-1965'
                disabled
              />
              <Input
                labelVariant='static'
                label='Medicare Number'
                defaultValue='1EG4-TE5-MK73'
                disabled
              />
              <Input
                labelVariant='static'
                label='Ambulatory Status'
                defaultValue='Non-ambulatory'
                disabled
              />
            </div>
          </div>

          <Separator className='bg-gray-200' />

          <div className='space-y-5'>
            <h2 className='text-brand-dark text-lg font-bold'>
              Transport Details
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              <Input
                labelVariant='static'
                label='Pickup Address'
                defaultValue='1234 Elm Street, Boston, MA 02101'
                disabled
              />
              <Input
                labelVariant='static'
                label='Destination'
                defaultValue='Massachusetts General Hospital, 55 Fruit St'
                disabled
              />
              <Input
                labelVariant='static'
                label='Appointment Date'
                defaultValue='01-10-2025'
                disabled
              />
              <Input
                labelVariant='static'
                label='Appointment Time'
                defaultValue='10:30 AM'
                disabled
              />
              <Input
                labelVariant='static'
                label='Transport Type'
                defaultValue='Ambulance'
                disabled
              />
              <Input
                labelVariant='static'
                label='Oxygen Required'
                defaultValue='Yes'
                disabled
              />
            </div>
          </div>

          <Separator className='bg-gray-200' />

          <div className='space-y-5'>
            <h2 className='text-brand-dark text-lg font-bold'>
              Medical Information
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              <Input
                labelVariant='static'
                label='Diagnosis'
                defaultValue='Congestive Heart Failure, COPD'
                disabled
              />
              <Input
                labelVariant='static'
                label='Ordering Physician'
                defaultValue='Dr. Michael Roberts'
                disabled
              />
              <Input
                labelVariant='static'
                label='Medical Necessity'
                defaultValue='Continuous oxygen support and medical monitoring required'
                disabled
              />
              <Input
                labelVariant='static'
                label='Physician Phone'
                defaultValue='(617) 555-0123'
                disabled
              />
            </div>
          </div>

          <SensitiveMessage
            variant='ai'
            title='AI Confidence Score: 98%'
            description='This form was automatically populated by our AI engine. All fields have been verified against patient records and physician notes'
          />
        </Window>

        <div className='space-y-5'>
          <div className='space-y-3'>
            <Button
              variant={'success'}
              size={'default'}
              className='rounded-3xl'
            >
              <CircleCheck
                size={20}
                className='text-white'
                strokeWidth={1.25}
              />{' '}
              Approve Request
            </Button>
            <Button
              variant={'destructive-outlined'}
              size={'default'}
              className='rounded-3xl'
            >
              <CircleX size={20} color='#FE5C73' strokeWidth={1.25} /> Deny
              Request
            </Button>
          </div>

          <Window className='p-6'>
            <h3 className='text-brand-dark mb-5 text-xl font-bold'>
              Activity Log
            </h3>
            <StatusTimeline
              items={[
                {
                  title: 'Request Submitted',
                  date: 'Jan 15, 2025 at 10:30 AM',
                  status: 'approved',
                },
                {
                  title: 'Under Review',
                  date: 'Jan 16, 2025 at 10:30 AM',
                  status: 'pending',
                },
                {
                  title: 'Insurance Reviewer',
                  description:
                    'Additional documentation may be required for medical necessity.',
                  status: 'denied',
                },
              ]}
            />
          </Window>
        </div>
      </section>
    </main>
  );
};

export default AuthorizationRequestDetails;
