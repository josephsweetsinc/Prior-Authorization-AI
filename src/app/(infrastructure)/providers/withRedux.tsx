'use client';

import { type ComponentType } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';

export const withRedux = <Props extends object>(
  Component: ComponentType<Props>,
) => {
  return function withRedux(props: Props) {
    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
};
