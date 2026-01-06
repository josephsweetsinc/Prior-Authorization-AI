import { type IFormData } from './types/types';

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
