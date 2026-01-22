'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlert } from 'lucide-react';
import { useEffect, useRef, useState, useId } from 'react';

import ArrowDownIcon from '@/shared/assets/icons/arrow_down';
import { cn } from '@/shared/lib/utils';

const selectTriggerVariants = cva(
  'inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-md font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 w-full cursor-pointer border-1',
  {
    variants: {
      variant: {
        default: 'bg-white border-[#E8E8E8] text-primary hover:bg-gray-50',
        outlined: 'border-primary text-primary bg-transparent',
        ghost: 'border-transparent hover:bg-accent',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-6 text-sm',
        lg: 'h-14 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface SelectProps extends VariantProps<typeof selectTriggerVariants> {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (_value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  withIcon?: boolean;
  label?: string;
  labelClassName?: string;
  id?: string;
  error?: React.ReactNode;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select Reason',
  variant,
  size,
  className,
  triggerClassName,
  withIcon = true,
  label,
  labelClassName,
  id,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const triggerId = id || `select-trigger-${generatedId}`;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  };

  const toggleOpen = () => {
    if (isOpen) {
      handleClose();
    } else {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const menuHeight = 240;
        setOpenUpward(spaceBelow < menuHeight && rect.top > menuHeight);
      }
      setIsOpen(true);
    }
  };

  const checkDirection = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 240;
      setOpenUpward(spaceBelow < menuHeight && rect.top > menuHeight);
    }
  };

  useEffect(() => {
    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        if (isOpen && !isClosing) {
          checkDirection();
        }
      });
    };

    if (isOpen) {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, isClosing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          handleClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const trimmedLabel = label?.trim();

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      data-slot='select-container'
    >
      {trimmedLabel ? (
        <label
          htmlFor={triggerId}
          className={cn(
            'font-nunito-sans mb-2 block text-base font-medium',
            labelClassName,
          )}
        >
          {trimmedLabel}
        </label>
      ) : null}

      <button
        id={triggerId}
        type='button'
        onClick={toggleOpen}
        className={cn(
          selectTriggerVariants({ variant, size }),
          triggerClassName,
          {
            'ring-destructive/20 dark:ring-destructive/40 border-destructive':
              !!error,
            'border-status-info': isOpen,
          },
        )}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'font-nunito-sans truncate text-left text-sm transition-colors',
            !selectedOption
              ? 'text-muted-foreground font-normal'
              : 'text-primary font-medium',
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {withIcon && (
          <ArrowDownIcon
            className={cn(
              'shrink-0 opacity-50 transition-transform duration-200',
              isOpen && !isClosing && 'rotate-180',
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 max-h-60 w-max min-w-full overflow-auto rounded-xl border bg-white p-1 shadow-xl',
            'transition-all duration-150 ease-in-out',
            openUpward
              ? 'bottom-full mb-2 origin-bottom'
              : 'top-full mt-2 origin-top',
            isClosing
              ? 'animate-out fade-out zoom-out-95 scale-95 opacity-0'
              : 'animate-in fade-in zoom-in-95 scale-100 opacity-100',
          )}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'text-md relative flex cursor-pointer items-center rounded-lg px-4 py-3 transition-colors outline-none select-none hover:bg-gray-100',
                value === option.value &&
                  'text-primary bg-gray-50 font-semibold',
              )}
              onClick={() => {
                onChange?.(option.value);
                handleClose();
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          className='text-destructive flex items-center gap-1 text-sm'
          role='alert'
        >
          <CircleAlert size={13} /> {error}
        </div>
      )}
    </div>
  );
}
