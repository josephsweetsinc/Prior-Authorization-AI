import { cn } from '@/shared/lib/utils';

type TitleAndDescProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export const TitleAndDesc = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: TitleAndDescProps) => {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <section className={cn('flex flex-col gap-1', className)}>
      {title && (
        <h1
          className={cn(
            'text-brand-dark text-[32px] font-bold',
            titleClassName,
          )}
        >
          {title}
        </h1>
      )}

      {subtitle && (
        <p
          className={cn(
            'text-gray-dark text-[18px] font-medium',
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
};
