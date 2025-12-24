export interface Payment {
  id: string;
  patient: string;
  transportType: 'Ambulance' | 'Wheelchair' | 'Air Ambulance' | 'Stretcher';
  status: 'Approved' | 'Pending' | 'Denied';
  email: string;
}
