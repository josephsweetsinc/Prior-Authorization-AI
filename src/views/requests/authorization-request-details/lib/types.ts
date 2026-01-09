import {
  type AmbulatoryStatus,
  type TransportationType,
} from '@/services/requests';

export type RequestDetailsFormState = {
  patientName: string;
  patientDob: string;
  patientId: string;
  ambulatoryStatus: AmbulatoryStatus | '';
  pickupAddress: string;
  destinationAddress: string;
  appointmentDate: string;
  appointmentTime: string;
  transportationType: TransportationType | '';
  oxygenRequired: boolean | undefined;
  primaryDiagnosis: string;
  medicalJustification: string;
  orderingPhysician: string;
  physicianPhone: string;
};

export type RequestDetailsTimelineItem = {
  title: string;
  date?: string;
  description?: string;
  status: 'approved' | 'pending' | 'processing' | 'denied';
};
