import { format } from 'date-fns';

import {
  type IRequestDetails,
  type RequestUpdatePayload,
} from '@/services/requests';
import { STATUS_CONFIG } from '@/shared/components/status-chip';

import { STATUS_LABELS, TIMELINE_STATUS_MAP } from '../constants';
import { type RequestDetailsFormState } from '../types';

const normalizeTransportTime = (value?: string | null) =>
  value ? value.slice(0, 5) : '';

const splitPatientName = (fullName: string) => {
  const trimmedName = fullName.trim();
  const [firstName, ...lastNameParts] = trimmedName.split(/\s+/);

  return {
    patient_first_name: firstName ?? '',
    patient_last_name: lastNameParts.join(' '),
  };
};

export const buildRequestDetailsUiState = (data: IRequestDetails) => {
  const statusConfig = STATUS_CONFIG[data.status];
  const shouldShowActions =
    data.status !== 'approved' && data.status !== 'denied';
  const patientName =
    `${data.patient_first_name} ${data.patient_last_name}`.trim();
  const requestLabel = data.form_number || String(data.id);

  const timelineItems = data.status_history.map((item) => ({
    title: STATUS_LABELS[item.status] ?? 'Status Update',
    date: item.created_at
      ? format(new Date(item.created_at), 'MMM dd, yyyy p')
      : undefined,
    description: item.notes ?? undefined,
    status: TIMELINE_STATUS_MAP[item.status] ?? 'pending',
  }));

  return {
    statusConfig,
    shouldShowActions,
    patientName,
    requestLabel,
    timelineItems,
  };
};

export const buildRequestDetailsFormState = (
  data: IRequestDetails,
): RequestDetailsFormState => ({
  patientName: `${data.patient_first_name} ${data.patient_last_name}`.trim(),
  patientDob: data.patient_date_of_birth ?? '',
  patientId: data.patient_id ?? '',
  ambulatoryStatus: data.ambulatory_status ?? '',
  pickupAddress: data.pickup_address ?? '',
  destinationAddress: data.destination_address ?? '',
  appointmentDate: data.date_of_transport ?? '',
  appointmentTime: normalizeTransportTime(data.time_of_transport),
  transportationType: data.transportation_type ?? '',
  oxygenRequired: data.oxygen_required,
  primaryDiagnosis: data.primary_diagnosis ?? '',
  medicalJustification: data.medical_justification ?? '',
  orderingPhysician: data.ordering_physician ?? '',
  physicianPhone: data.physician_phone ?? '',
});

export const buildRequestUpdatePayload = (
  formState: RequestDetailsFormState,
): RequestUpdatePayload => {
  const { patient_first_name, patient_last_name } = splitPatientName(
    formState.patientName,
  );

  return {
    transportation_type: formState.transportationType || undefined,
    patient_first_name,
    patient_last_name,
    patient_date_of_birth: formState.patientDob || undefined,
    patient_id: formState.patientId,
    date_of_transport: formState.appointmentDate || undefined,
    time_of_transport: formState.appointmentTime || undefined,
    pickup_address: formState.pickupAddress,
    destination_address: formState.destinationAddress,
    primary_diagnosis: formState.primaryDiagnosis,
    medical_justification: formState.medicalJustification,
    ambulatory_status: formState.ambulatoryStatus || undefined,
    oxygen_required: formState.oxygenRequired ?? undefined,
    ordering_physician: formState.orderingPhysician,
    physician_phone: formState.physicianPhone,
  };
};
