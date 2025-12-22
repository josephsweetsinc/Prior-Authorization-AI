'use client';

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ChartDatum = Record<string, string | number>;

interface BarChartProps<T extends ChartDatum> {
  data: T[];
  xKey: keyof T;
  valueKey: keyof T;
  tooltipLabel?: string;
  height?: number | string;
  barSize?: number;
}

type TooltipPayload = {
  value: number;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  title: string;
}

export function BarChart<T extends ChartDatum>({
  data,
  xKey,
  valueKey,
  tooltipLabel = 'Requests',
  height = 400,
  barSize = 12,
}: BarChartProps<T>) {
  return (
    <div className='w-full' style={{ height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <ReBarChart data={data}>
          <defs>
            <linearGradient id='barGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5.56%' stopColor='#047CB4' />
              <stop offset='100%' stopColor='rgba(4, 124, 180, 0.08)' />
            </linearGradient>

            <linearGradient id='barHoverGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='rgba(4, 124, 180, 0.35)' />
              <stop offset='100%' stopColor='rgba(4, 124, 180, 0.12)' />
            </linearGradient>
          </defs>

          <XAxis dataKey={xKey as string} axisLine={false} tickLine={false} />

          <Tooltip
            content={<CustomTooltip title={tooltipLabel} />}
            cursor={{ fill: 'rgba(4, 124, 180, 0.04)' }}
          />

          <Bar
            dataKey={valueKey as string}
            fill='url(#barGradient)'
            radius={[8, 8, 0, 0]}
            barSize={barSize}
            activeBar={{ fill: 'url(#barHoverGradient)' }}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, title }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className='rounded-xl border bg-white px-4 py-2 shadow-md'>
      <div className='text-muted-foreground text-xs'>{title}</div>
      <div className='text-foreground text-xl font-semibold'>
        {payload[0].value}
      </div>
    </div>
  );
}

export default BarChart;
