import { OverlayIcon, Window } from '@/shared/components';

const summaryItems = [
  {
    label: 'Submitted',
    value: '156',
    icon: 'FileText',
    color: 'blue',
  },
  {
    label: 'Approved',
    value: '128',
    icon: 'HeartPulse',
    color: 'green',
  },
  {
    label: 'Pending',
    value: '18',
    icon: 'ClockFading',
    color: 'orange',
  },
  {
    label: 'Denied',
    value: '10',
    icon: 'Shuffle',
    color: 'red',
  },
] as const;

export const ActivitySummaryCard = () => {
  return (
    <Window className='p-5'>
      <div className='space-y-8'>
        <h3 className='text-xl font-bold text-[#232323]'>Activity Summary</h3>
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
                <p className='text-[#4A5568]'>{item.label}</p>
                <p className='text-2xl font-semibold text-[#232323]'>
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
