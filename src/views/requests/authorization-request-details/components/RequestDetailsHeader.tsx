import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { TitleAndDesc } from '@/shared/components';

type Props = {
  title: string;
  subtitle: string;
  extra?: ReactNode;
};

export const RequestDetailsHeader = ({ title, subtitle, extra }: Props) => (
  <section className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
    <div className='space-y-4'>
      <Link
        href='/requests'
        className='flex items-center text-sm text-[#4A5568]'
      >
        <ChevronLeft
          color='#4A5568'
          strokeWidth={1.25}
          width={16}
          height={16}
        />{' '}
        Back to Request
      </Link>
      <TitleAndDesc
        title={title}
        subtitle={subtitle}
        titleClassName='text-2xl md:text-3xl'
        subtitleClassName='text-base'
      />
    </div>
    {extra}
  </section>
);
