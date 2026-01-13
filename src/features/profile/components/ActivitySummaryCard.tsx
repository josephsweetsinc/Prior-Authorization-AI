'use client';

import { useGetProviderStatsQuery } from '@/services/stats';
import { OverlayIcon, Window } from '@/shared/components';

import { extractProviderSummary } from '../utils/extractProviderSummary';

export const ActivitySummaryCard = () => {
  const { data: stats } = useGetProviderStatsQuery();
  const summaryItems = extractProviderSummary(stats);

  return (
    <Window className='p-5'>
      <div className='space-y-8'>
        <h3 className='text-xl font-bold text-black'>Activity Summary</h3>
        <div className='grid gap-3 sm:grid-cols-2'>
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className='flex items-center gap-2.5 rounded-2xl bg-[#FBFBFB] px-5 py-3'
            >
              <OverlayIcon
                variant={item.icon}
                color={item.color}
                className='size-8 p-3.5'
                strokeWidth={1.5}
              />
              <div>
                <p className='text-gray-dark'>{item.label}</p>
                <p className='text-2xl font-semibold text-black'>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
