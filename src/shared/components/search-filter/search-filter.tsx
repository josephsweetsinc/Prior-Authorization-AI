'use client';
import { type ChangeEvent, useEffect, useState } from 'react';

import { Input } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { type InputProps } from '../inputs/input';

type Props = {
  value?: string;
  placeholder?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  debounce?: number;
} & Omit<InputProps, 'onChange' | 'value'>;

export const SearchFilter = ({
  value = '',
  onChange,
  debounce = 150,
  className,
  placeholder,
  labelVariant = 'static',
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
      placeholder={placeholder}
      labelVariant={labelVariant}
      onChange={handleChange}
      className={cn(
        className,
        '!placeholder:text-[#A3AED0] !h-[38px] !rounded-[18px] !bg-white !px-8 !py-2.5 !shadow-none',
      )}
      {...props}
    />
  );
};
