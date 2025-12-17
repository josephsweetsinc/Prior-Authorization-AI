import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'border-1 w-full text-md font-medium text-primary cursor-pointer hover:bg-primary/2',
        'default-outlined':
          'border-1 border-primary w-full text-md font-medium text-primary cursor-pointer hover:bg-primary/2',
        primary:
          'bg-primary-gradient w-full text-md font-light cursor-pointer text-primary-foreground hover:animate-pulse',
        destructive:
          'bg-destructive w-full text-md font-light cursor-pointer text-primary-foreground hover:animate-pulse ',
        'destructive-outlined':
          'border-1 border-destructive w-full text-md font-light cursor-pointer text-destructive hover:bg-primary/2 ',
        success:
          'bg-success w-full text-md font-light cursor-pointer text-primary-foreground hover:animate-pulse',
        ghost:
          'hover:bg-accent cursor-pointer text-md font-medium w-full hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        default: 'h-9 px-6 py-6 has-[>svg]:px-3 rounded-md',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9 rounded-full shadow-sm',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
