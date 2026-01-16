import { type ReportFileFormat } from '@/services/reports';

export const DATE_RANGE_DISPLAY_FORMAT = 'MM/dd/yyyy';

export const FORMAT_OPTIONS: { label: string; value: ReportFileFormat }[] = [
  { label: 'Excel', value: 'excel' },
  { label: 'PDF', value: 'pdf' },
];

export const DATE_OPTIONS = [
  { value: '0', label: 'Today' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '365', label: 'This Year' },
];
