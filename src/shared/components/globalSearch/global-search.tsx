'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useIsAdmin, useSearchRequestsByPatientQuery } from '@/services';
import { cn } from '@/shared/lib/utils';

import { Input } from '../inputs';

import { fallbackResults } from './constants';
import type {
  GlobalSearchControlProps,
  GlobalSearchResultGroup,
  GlobalSearchResultItem,
  SearchResultsPanelProps,
} from './types';
import {
  buildSearchPayload,
  buildSearchResults,
  DEBOUNCE_DELAY_MS,
} from './utils';

const globalSearchVariants = cva('min-w-[288px] w-full', {
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

const SearchResultsPanel = ({
  isOpen,
  isSearching,
  trimmedValue,
  hasResults,
  displayResults,
  onItemClick,
}: SearchResultsPanelProps) => {
  if (!isOpen) {
    return null;
  }

  let content: ReactNode = (
    <div className='space-y-2'>
      {displayResults.map((group, groupIndex) => (
        <div key={group.title ?? `group-${groupIndex}`}>
          {group.title ? (
            <p className='px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 uppercase'>
              {group.title}
            </p>
          ) : null}
          <div className='space-y-1'>
            {group.items.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => onItemClick(item)}
                className='flex w-full flex-col gap-1 rounded-xl px-3 py-2 text-left transition hover:bg-[#EAF7FE]'
              >
                <span className='text-sm font-medium text-slate-800'>
                  {item.title}
                </span>
                {item.subtitle ? (
                  <span className='text-xs text-slate-500'>
                    {item.subtitle}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (isSearching) {
    content = (
      <div className='px-4 py-6 text-center text-sm text-slate-500'>
        Searching...
      </div>
    );
  } else if (trimmedValue.length === 0) {
    content = (
      <div className='px-4 py-6 text-center text-sm text-slate-500'>
        Start typing to search patients or requests.
      </div>
    );
  } else if (!hasResults) {
    content = (
      <div className='px-4 py-6 text-center text-sm text-slate-500'>
        No matches yet.
      </div>
    );
  }

  return (
    <div className='absolute top-full right-0 left-0 z-40 mt-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.16)]'>
      <div className='custom-scrollbar max-h-[360px] overflow-y-auto px-1 py-1'>
        {content}
      </div>
    </div>
  );
};

export type GlobalSearchProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  'size'
> &
  VariantProps<typeof globalSearchVariants> &
  GlobalSearchControlProps & {
    results?: GlobalSearchResultGroup[];
    isLoading?: boolean;
  };

const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
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
    const [debouncedValue, setDebouncedValue] = useState('');
    const rootRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
    const inputValue = value ?? internalValue;
    const shouldUseQuery = results === undefined;

    const setOpen = useCallback(
      (nextOpen: boolean) => {
        onOpenChange(nextOpen);
      },
      [onOpenChange],
    );

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const handleOutsideClick = (event: MouseEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [isOpen, setOpen]);

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

    const trimmedValue = `${inputValue ?? ''}`.trim();

    useEffect(() => {
      const handler = window.setTimeout(() => {
        setDebouncedValue(trimmedValue);
      }, DEBOUNCE_DELAY_MS);

      return () => {
        window.clearTimeout(handler);
      };
    }, [trimmedValue]);

    const shouldSkipSearch = !shouldUseQuery || debouncedValue.length === 0;

    const { data: searchData, isFetching } = useSearchRequestsByPatientQuery(
      buildSearchPayload(debouncedValue),
      {
        skip: shouldSkipSearch,
      },
    );

    const fetchedResults = buildSearchResults(searchData?.request_ids);

    const displayResults =
      results ??
      (shouldUseQuery ? fetchedResults : undefined) ??
      fallbackResults;
    const hasResults = displayResults.some((group) => group.items.length > 0);
    const isSearching = isFetching;

    const handleResultClick = (item: GlobalSearchResultItem) => {
      if (!item.requestId || isAdminLoading) {
        return;
      }

      if (isAdmin) {
        router.push(`/requests/${item.requestId}`);
      } else {
        router.push(`/requests-history?requestId=${item.requestId}`);
      }

      setOpen(false);
    };

    return (
      <div
        className={cn(
          'relative z-30',
          globalSearchVariants({ size }),
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
            isOpen &&
              '!border-status-info/40 !shadow-[0_18px_40px_rgba(4,124,180,0.18)]',
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

        <SearchResultsPanel
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
