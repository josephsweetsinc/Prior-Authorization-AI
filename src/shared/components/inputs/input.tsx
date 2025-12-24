'use client';

import { Eye, EyeOff, Search } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: React.ReactNode;
  labelVariant?: 'floating' | 'static';
}

function Input({
  className,
  label,
  type,
  error,
  id,
  labelVariant = 'floating',
  placeholder,
  ...props
}: InputProps) {
  const isPassword = type === 'password';
  const isSearch = type === 'search';
  const [visible, setVisible] = React.useState(false);

  const invalid = !!error || props['aria-invalid'] === true;
  const generatedId = React.useId();
  const inputId = (id as string) || `input-${generatedId}`;

  const placeholderProp = labelVariant === 'floating' ? ' ' : placeholder;

  return (
    <div className='w-full min-w-50'>
      {label && labelVariant === 'static' ? (
        <label
          htmlFor={inputId}
          className={cn(
            'mb-1 block text-sm font-medium text-slate-700',
            invalid && 'text-destructive',
          )}
        >
          {label?.trim()}
        </label>
      ) : null}

      <div className='relative'>
        <input
          id={inputId}
          type={isPassword ? (visible ? 'text' : 'password') : type}
          data-slot='input'
          placeholder={placeholderProp}
          aria-invalid={invalid}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
            // add peer only for floating labels (floating relies on peer classes)
            labelVariant === 'floating'
              ? 'peer ease focus:border-accent-foreground w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 focus:shadow-none focus:outline-none'
              : 'ease focus:border-accent-foreground w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-300 focus:shadow-none focus:outline-none',
            'h-9 rounded-md px-6 py-6 has-[>svg]:px-3',
            isSearch && 'rounded-xl pl-8',
          )}
          {...props}
        />

        {isSearch && (
          <Search
            size={18}
            className='absolute top-1/2 left-3 -translate-y-1/2 text-slate-400'
          />
        )}

        {label && labelVariant === 'floating' ? (
          <label
            htmlFor={inputId}
            className={cn(
              'peer-focus:text-accent-foreground pointer-events-none absolute top-3.5 left-2.5 origin-left transform cursor-text bg-white px-1 text-sm text-slate-400 transition-all peer-not-placeholder-shown:text-transparent peer-not-focus:bg-transparent peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90 peer-focus:text-xs',
              isSearch && 'left-7.5',
              invalid && 'text-destructive peer-focus:text-destructive',
            )}
          >
            {label}
          </label>
        ) : null}

        {isPassword && (
          <button
            type='button'
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400'
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className='text-destructive mt-1 text-sm' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };
