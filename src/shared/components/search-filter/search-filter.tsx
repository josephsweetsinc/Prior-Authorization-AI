'use client';
import { type ChangeEvent, useEffect, useState } from 'react';

import { Input } from '@/shared/components';

import { type InputProps } from '../inputs/input';

type Props = {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<InputProps, 'onChange' | 'value'>;

export const SearchFilter = ({
  value = '',
  onChange,
  debounce = 150,
  className,
  ...props
}: Props) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue);
    }, debounce);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  return (
    <Input
      type='search'
      value={internalValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
};
