'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { forwardRef } from 'react';
import { toast } from 'react-toastify';

import { useIsAdmin, useSearchRequestsByPatientQuery } from '@/services';
import { cn } from '@/shared/lib/utils';

import { Input } from '../inputs';

export type GlobalSearchResultItem = {
  id: string;
  title: string;
  subtitle?: string;
  requestId?: number;
};

export type GlobalSearchResultGroup = {
  title?: string;
  items: GlobalSearchResultItem[];
};

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

export type GlobalSearchProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  'size'
> &
  VariantProps<typeof globalSearchVariants> & {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    results?: GlobalSearchResultGroup[];
    isLoading?: boolean;
  };

const fallbackResults: GlobalSearchResultGroup[] = [
  {
    title: 'Conditions',
    items: [
      {
        id: 'condition-1',
        title: "Chronic Parkinson's disease",
        subtitle: 'James Willson',
      },
      {
        id: 'condition-2',
        title: 'Chronic COPD with oxygen dependence',
        subtitle: 'Robert Martinez',
      },
    ],
  },
  {
    title: 'Requests',
    items: [
      {
        id: 'request-1',
        title: 'Chronic heart failure, mobility impaired',
        subtitle: 'Mary Thompson',
      },
    ],
  },
];

const GlobalSearch = forwardRef<HTMLInputElement, GlobalSearchProps>(
  (
    {
      className,
      size,
      isOpen: controlledOpen,
      onOpenChange,
      results,
      isLoading,
      value,
      onChange,
      onFocus,
      onKeyDown,
      placeholder = 'Search patients or requests',
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState('');
    const [debouncedValue, setDebouncedValue] = React.useState('');
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
    const isOpen = controlledOpen ?? uncontrolledOpen;
    const inputValue = value ?? internalValue;
    const shouldUseQuery = results === undefined;

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [controlledOpen, onOpenChange],
    );

    React.useEffect(() => {
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

    React.useEffect(() => {
      const handler = window.setTimeout(() => {
        setDebouncedValue(trimmedValue);
      }, 250);

      return () => {
        window.clearTimeout(handler);
      };
    }, [trimmedValue]);

    const numericQuery = debouncedValue.length
      ? /^[0-9]+$/.test(debouncedValue)
      : false;

    const { data: searchData, isFetching } = useSearchRequestsByPatientQuery(
      debouncedValue
        ? {
            patient_id: numericQuery ? debouncedValue : undefined,
            patient_name: numericQuery ? undefined : debouncedValue,
          }
        : undefined,
      {
        skip: !shouldUseQuery || debouncedValue.length === 0,
      },
    );

    const fetchedResults: GlobalSearchResultGroup[] | undefined = searchData
      ?.request_ids?.length
      ? [
          {
            title: 'Requests',
            items: searchData.request_ids.map((id) => ({
              id: `request-${id}`,
              requestId: id,
              title: `Request #${id}`,
              subtitle: 'Patient match',
            })),
          },
        ]
      : [];

    const displayResults =
      results ??
      (shouldUseQuery ? fetchedResults : undefined) ??
      fallbackResults;
    const hasResults = displayResults.some((group) => group.items.length > 0);
    const isSearching = isLoading ?? isFetching;

    const handleResultClick = (item: GlobalSearchResultItem) => {
      if (!item.requestId) {
        return;
      }

      if (isAdminLoading) {
        return;
      }

      if (isAdmin) {
        router.push(`/requests/${item.requestId}`);
      } else {
        toast.info('Provider view will be added soon.');
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

        {isOpen && (
          <div className='absolute top-full right-0 left-0 z-40 mt-3 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.16)]'>
            <div className='custom-scrollbar max-h-[360px] overflow-y-auto px-1 py-1'>
              {isSearching ? (
                <div className='px-4 py-6 text-center text-sm text-slate-500'>
                  Searching...
                </div>
              ) : trimmedValue.length === 0 ? (
                <div className='px-4 py-6 text-center text-sm text-slate-500'>
                  Start typing to search patients or requests.
                </div>
              ) : !hasResults ? (
                <div className='px-4 py-6 text-center text-sm text-slate-500'>
                  No matches yet.
                </div>
              ) : (
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
                            onClick={() => handleResultClick(item)}
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
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

GlobalSearch.displayName = 'GlobalSearch';

export { GlobalSearch };
