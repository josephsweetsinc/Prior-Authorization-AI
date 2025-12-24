'use client';

import compose from 'compose-function';
import { type PropsWithChildren, type FC } from 'react';

import { withRedux } from './withRedux';
import { withToastify } from './withToastify';

export const withProviders = compose<FC<PropsWithChildren>>(
  withToastify,
  withRedux,
);
