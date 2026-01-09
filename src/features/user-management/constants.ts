import { type ICreateFormData } from './types';

export const USER_FORM_DEFAULTS: ICreateFormData = {
  fullName: '',
  email: '',
  role: 'admin',
  password: '',
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
