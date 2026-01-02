'use client';
import { type ChangeEvent, type HTMLProps, useEffect, useState } from 'react';

import { Input } from '@/shared/components';

type Props = {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value' | 'type'>;

export const RequestsHeaderSearch = ({
  value = '',
  onChange,
  debounce = 300,
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
