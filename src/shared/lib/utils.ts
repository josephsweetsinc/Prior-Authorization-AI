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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupByX<T extends Record<string, any>>(
  data: T[],
  xKey: keyof T,
  valueKey: keyof T,
) {
  const map = new Map<string, number>();

  data.forEach((item) => {
    const x = String(item[xKey]);
    const value = Number(item[valueKey]) || 0;
    map.set(x, (map.get(x) ?? 0) + value);
  });

  return Array.from(map.entries()).map(([x, value]) => ({
    [xKey]: x,
    [valueKey]: value,
  })) as T[];
}
