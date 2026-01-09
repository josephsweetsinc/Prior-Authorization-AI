import { cn } from '@/shared/lib/utils';

type Props = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export const PageButton = ({ children, active, disabled, onClick }: Props) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors',
        disabled && 'cursor-not-allowed opacity-40',
        active
          ? 'bg-accent-foreground text-primary-foreground'
          : 'hover:bg-muted text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
};
