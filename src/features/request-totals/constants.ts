import { type icons } from 'lucide-react';

type IMetric = {
  id: number;
  label: string;
  value: string;
  icon: keyof typeof icons;
  color: 'blue' | 'green' | 'orange' | 'indigo';
};

export const metrics: IMetric[] = [
  {
    id: 1,
    label: 'Total Requests',
    value: '248',
    icon: 'FileChartColumnIncreasing' as keyof typeof icons,
    color: 'blue',
  },
  {
    id: 2,
    label: 'Pending Review',
    value: '12',
    icon: 'ClockFading' as keyof typeof icons,
    color: 'orange',
  },
  {
    id: 3,
    label: 'Approved',
    value: '215',
    icon: 'HeartPulse' as keyof typeof icons,
    color: 'green',
  },
  {
    id: 4,
    label: 'Approval Rate',
    value: '96,4%',
    icon: 'ChartNoAxesCombined' as keyof typeof icons,
    color: 'indigo',
  },
];
