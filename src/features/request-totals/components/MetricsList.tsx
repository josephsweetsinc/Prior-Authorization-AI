import { type HTMLProps } from 'react';

import { OverlayIcon } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { metrics } from '../constants';

import MetricsCard from './MetricsCard';

type Props = HTMLProps<HTMLElement>;

export const MetricsList = ({ className, ...props }: Props) => {
  return (
    <section
      className={cn('flex flex-wrap items-center gap-5', className)}
      {...props}
    >
      {metrics.map((card) => (
        <MetricsCard
          className='flex shrink grow basis-63 items-center gap-4'
          key={card.id}
        >
          <OverlayIcon variant={card.icon} color={card.color} />
          <MetricsCard.Group>
            <MetricsCard.Label>{card.label}</MetricsCard.Label>
            <MetricsCard.Value>{card.value}</MetricsCard.Value>
          </MetricsCard.Group>
        </MetricsCard>
      ))}
    </section>
  );
};
