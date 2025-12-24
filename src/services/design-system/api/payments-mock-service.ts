import { type Payment } from '../types/types';

export function getMockedPayments(): Payment[] {
  return [
    {
      id: 'REQ-12850',
      patient: 'John Anderson',
      transportType: 'Ambulance',
      status: 'Approved',
      email: 'm@example.com',
    },
    {
      id: 'REQ-12851',
      patient: 'Mary Thompson',
      transportType: 'Wheelchair',
      status: 'Pending',
      email: 'm@example.com',
    },
    {
      id: 'REQ-12852',
      patient: 'Robert Martinez',
      transportType: 'Air Ambulance',
      status: 'Denied',
      email: 'm@example.com',
    },
    {
      id: 'REQ-12853',
      patient: 'Patricia Davis',
      transportType: 'Stretcher',
      status: 'Denied',
      email: 'm@example.com',
    },
  ];
}
