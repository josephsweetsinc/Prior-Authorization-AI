'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { DonutTooltip } from './donut-tooltip';

export type DonutDatum = {
  label: string;
  value: number;
  percentage: number;
  color: string;
};

interface DonutChartProps {
  data: DonutDatum[];
  height?: number;
}

export const DonutChart = ({ data, height = 290 }: DonutChartProps) => {
  return (
    <div className='flex w-full flex-col gap-12 md:flex-row md:items-center'>
      <div className='relative h-full w-full'>
        <ResponsiveContainer width='100%' height={height}>
          <PieChart style={{ outline: 'none' }}>
            <Pie
              data={data}
              dataKey='percentage'
              innerRadius='65%'
              outerRadius='90%'
              paddingAngle={3}
              stroke='#ffffff'
              strokeWidth={2}
              isAnimationActive
              style={{ outline: 'none' }}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ outline: 'none' }}
                />
              ))}
              <Tooltip
                content={<DonutTooltip />}
                cursor={{ fill: 'rgba(4, 124, 180, 0.04)' }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='flex flex-col gap-4'>
        {data.map((item) => (
          <div key={item.label} className='flex items-center gap-3 text-sm'>
            <span
              className='h-4 w-4 rounded-sm'
              style={{ backgroundColor: item.color }}
            />
            <span className='text-muted-foreground'>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
