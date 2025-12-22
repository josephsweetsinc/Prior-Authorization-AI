'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from 'recharts';

type DonutDatum = {
  label: string;
  value: number;
  color: string;
};

interface DonutChartProps {
  data: DonutDatum[];
  height?: number;
}

const RADIAN = Math.PI / 180;

export const DonutChart = ({ data, height = 290 }: DonutChartProps) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: PieLabelRenderProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = midAngle && cx + radius * Math.cos(-midAngle * RADIAN);
    const y = midAngle && cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor='middle'
        dominantBaseline='central'
        className='text-md font-normal'
      >
        {value}%
      </text>
    );
  };

  return (
    <div className='flex w-full flex-col gap-12 md:flex-row md:items-center'>
      <div className='relative h-full w-full'>
        <ResponsiveContainer width='100%' height={height}>
          <PieChart style={{ outline: 'none' }}>
            <Pie
              data={data}
              dataKey='value'
              innerRadius='65%'
              outerRadius='90%'
              paddingAngle={3}
              stroke='#ffffff'
              strokeWidth={2}
              isAnimationActive
              style={{ outline: 'none' }}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ outline: 'none' }}
                />
              ))}
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
