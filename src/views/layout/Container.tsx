'use client';

import { type ReactNode } from 'react';

import { withProviders } from '@/app/(infrastructure)/providers';

const Container = ({ children }: { children: ReactNode }) => {
  return children;
};

export default withProviders(Container);
