import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toAbs = (path?: string): string => {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('blob:')) {
    return path;
  }

  const prefix = path.startsWith('/') ? '' : '/';

  return `${BASE_URL}${prefix}${path}`;
};
