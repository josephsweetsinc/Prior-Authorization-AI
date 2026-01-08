export type ProviderStats = {
  total_requests: number;
  approved: number;
  submitted: number;
  rejected: number;
};

export type AdminUsersStats = {
  full_name: string;
  email: string;
  recent_admins: Array<{
    full_name: string;
    email: string;
  }>;
};
