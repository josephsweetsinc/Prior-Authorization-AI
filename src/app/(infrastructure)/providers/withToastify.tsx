'use client';

import { type ComponentType } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { TOASTIFY_CONFIG } from '../configs/toastify';

export const withToastify = <Props extends object>(
  Component: ComponentType<Props>,
) =>
  function withToastify(props: Props) {
    return (
      <>
        <ToastContainer {...TOASTIFY_CONFIG} />
        <Component {...props} />
      </>
    );
  };
