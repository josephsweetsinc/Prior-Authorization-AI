export type LoginRequest = {
  grant_type?: string | null;
  username: string;
  password: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
};

export type LoginResponse = {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user_role?: string;
};

export type ValidationError = {
  detail: Array<{ loc: Array<string | number>; msg: string; type: string }>;
};

export type PasswordResetRequestBody = {
  email: string;
};

export type PasswordResetResponse = void;

export type SignUpRequest = {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone_number: string;
  position: string;
  place_of_work: string;
};

export type SignUpResponse = {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  is_active: boolean;
};
