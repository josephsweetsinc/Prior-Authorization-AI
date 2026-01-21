'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useCallback, useRef, useState } from 'react';

import { Input } from '@/shared/components';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';
import { cn } from '@/shared/lib/utils';

import { DEBOUNCE_DELAY_MS } from '../constants';
import { useGlobalSearchResults, useSearchNavigation } from '../hooks';
import type {
  ISearchResultGroup,
  GlobalSearchControlProps,
  ISearchResult,
} from '../types';

import { SearchResults } from './SearchResults';

const variants = cva('min-w-[288px] w-full', {
  variants: {
    size: {
      small: 'max-w-1/3',
      medium: 'max-w-1/2',
      large: 'max-w-2/3 ',
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

export type Props = Omit<React.ComponentPropsWithoutRef<typeof Input>, 'size'> &
  VariantProps<typeof variants> &
  GlobalSearchControlProps & {
    results?: ISearchResultGroup[];
    isLoading?: boolean;
  };

const GlobalSearch = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      size,
      isOpen,
      onOpenChange,
      results,
      isLoading: _isLoading,
      value,
      onChange,
      onFocus,
      onKeyDown,
      placeholder = 'Search patients or requests',
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState('');

    const rootRef = useRef<HTMLDivElement>(null);

    const inputValue = value ?? internalValue;

    const setOpen = useCallback(
      (nextOpen: boolean) => {
        onOpenChange(nextOpen);
      },
      [onOpenChange],
    );

    useOutsideClick(rootRef, isOpen, () => setOpen(false));

    const trimmedValue = `${inputValue ?? ''}`.trim();

    const debouncedValue = useDebouncedValue(trimmedValue, DEBOUNCE_DELAY_MS);

    const { results: displayResults, isSearching } = useGlobalSearchResults(
      debouncedValue,
      results,
    );
    const navigateToResult = useSearchNavigation();

    const hasResults = displayResults.some((group) => group.items.length > 0);

    const handleResultClick = (item: ISearchResult) => {
      navigateToResult(item);
      setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
      if (!isOpen) {
        setOpen(true);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
      setOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    return (
      <div
        className={cn(
          'relative z-30',
          variants({ size }),
          isOpen && 'w-full max-w-none',
        )}
        ref={rootRef}
      >
        <Input
          ref={ref}
          type='search'
          labelVariant='static'
          className={cn(
            '!h-12 !rounded-2xl !border !border-slate-200 !bg-white !px-8 !py-3 text-sm text-slate-700 !shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-shadow focus:!shadow-[0_18px_40px_rgba(15,23,42,0.12)]',
            {
              '!border-status-info/40 !shadow-[0_18px_40px_rgba(4,124,180,0.18)]':
                isOpen,
            },
            className,
          )}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          {...props}
        />

        <SearchResults
          isOpen={isOpen}
          isSearching={isSearching}
          trimmedValue={trimmedValue}
          hasResults={hasResults}
          displayResults={displayResults}
          onItemClick={handleResultClick}
        />
      </div>
    );
  },
);

GlobalSearch.displayName = 'GlobalSearch';

export { GlobalSearch };
