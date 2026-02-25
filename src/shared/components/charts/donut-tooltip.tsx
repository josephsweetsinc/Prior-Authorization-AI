import { type TooltipPayload } from 'recharts/types/state/tooltipSlice';

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

export const DonutTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // @ts-expect-error payload is defined in Payload<ValueType, NameType>
  const { label, value, percentage, color } = payload[0].payload;

  const roundedPercentage = Math.round(percentage);

  return (
    <div className='rounded-md border bg-white px-3 py-2 text-sm shadow'>
      <div className='flex items-center gap-2'>
        <span
          className='h-3 w-3 rounded-sm'
          style={{ backgroundColor: color }}
        />
        <span className='font-medium'>{label}</span>
      </div>
      <div className='text-muted-foreground'>
        <span className='block'>{roundedPercentage}%</span>
        <span className='block'>{value} requests</span>
      </div>
    </div>
  );
};
