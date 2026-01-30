import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center w-full text-md font-nunito-sans cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'border-1 text-primary hover:bg-primary/2',
        'default-outlined':
          'border-1 border-primary text-primary hover:bg-primary/2',
        primary:
          'bg-primary-gradient text-primary-foreground hover:animate-pulse',
        secondary:
          'border border-status-info rounded-3xl font-medium text-status-info hover:bg-primary/2',
        destructive:
          'bg-destructive font-light text-primary-foreground hover:animate-pulse ',
        'destructive-outlined':
          'border-1 border-destructive font-light text-destructive hover:bg-primary/2 ',
        success:
          'bg-success font-light text-primary-foreground hover:animate-pulse',
        info: 'bg-status-info font-light text-primary-foreground hover:animate-pulse',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        gray: 'bg-[#E8E8E8] font-light text-black hover:animate-pulse',
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
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
