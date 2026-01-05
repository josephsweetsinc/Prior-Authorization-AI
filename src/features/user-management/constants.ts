import { type IFormData, type IUserEntry } from './types/types';

export const USER_FORM_DEFAULTS: IFormData = {
  fullName: '',
  email: '',
  role: 'admin',
};

export const ROLE_OPTIONS = [
  {
    label: 'Provider',
    value: 'provider',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
];

export const ROLE_FILTER_OPTIONS = [
  {
    label: 'All roles',
    value: 'all',
  },
  ...ROLE_OPTIONS,
];

export const usersMock: IUserEntry[] = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    is_active: true,
    last_login: '2025-02-01T09:15:00Z',
  },
  {
    id: 2,
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@example.com',
    role: 'provider',
    is_active: true,
    last_login: '2025-01-28T16:42:00Z',
  },
  {
    id: 3,
    name: 'Michael',
    surname: 'Brown',
    email: 'michael.brown@example.com',
    role: 'provider',
    is_active: false,
    last_login: '2024-12-18T11:05:00Z',
  },
  {
    id: 4,
    name: 'Emily',
    surname: 'Johnson',
    email: 'emily.johnson@example.com',
    role: 'provider',
    is_active: true,
    last_login: '2025-02-03T08:30:00Z',
  },
  {
    id: 5,
    name: 'Daniel',
    surname: 'Wilson',
    email: 'daniel.wilson@example.com',
    role: 'provider',
    is_active: false,
    last_login: '2024-11-02T19:55:00Z',
  },
];
