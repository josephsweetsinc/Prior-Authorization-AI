import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

// Стилі для контейнера та тригера (схоже на вашу кнопку)
const selectTriggerVariants = cva(
    'inline-flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-md font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 w-full cursor-pointer border-1',
    {
        variants: {
            variant: {
                default: 'bg-white border-gray-200 text-primary hover:bg-gray-50',
                outlined: 'border-primary text-primary bg-transparent',
                ghost: 'border-transparent hover:bg-accent',
            },
            size: {
                default: 'h-12 px-4 py-2',
                sm: 'h-9 px-3 text-sm',
                lg: 'h-14 px-6 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

interface SelectProps extends VariantProps<typeof selectTriggerVariants> {
    options: { label: string; value: string }[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    withIcon?: boolean;
}

export function Select({
                           options,
                           value,
                           onChange,
                           placeholder = 'Select option',
                           variant,
                           size,
                           className,
                           withIcon = true,
                       }: SelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Закриття при кліку поза компонентом
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div
            ref={containerRef}
            className={cn('relative w-full', className)}
            data-slot="select-container"
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(selectTriggerVariants({ variant, size }), isOpen && 'ring-[3px] ring-ring/50')}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                {withIcon && (
                    <ChevronDown
                        className={cn(
                            'size-5 transition-transform duration-200 shrink-0 opacity-50',
                            isOpen && 'rotate-180'
                        )}
                    />
                )}
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 mt-2 min-w-full w-max max-h-60 overflow-auto rounded-xl border bg-white p-1 shadow-xl animate-in fade-in zoom-in-95"
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={cn(
                                'relative flex cursor-pointer select-none items-center rounded-lg py-3 px-4 text-md outline-none transition-colors hover:bg-gray-100',
                                value === option.value && 'bg-gray-50 font-semibold text-primary'
                            )}
                            onClick={() => {
                                onChange?.(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}