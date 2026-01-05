import { type IUserEntry } from '../types';

export const filterByQuery = (users: IUserEntry[], query?: string) => {
  if (!query) {
    return users;
  }

  return users.filter((user) => user.email.includes(query.trim()));
};

export const filterByRole = (users: IUserEntry[], role: string) => {
  if (role === 'all') {
    return users;
  }

  return users.filter((user) => user.role === role);
};
