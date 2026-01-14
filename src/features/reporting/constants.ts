import { type ReportFileFormat } from '@/services/reports';

export const DATE_RANGE_DISPLAY_FORMAT = 'MM/dd/yyyy';

export const FORMAT_OPTIONS: { label: string; value: ReportFileFormat }[] = [
  { label: 'Excel', value: 'excel' },
  { label: 'PDF', value: 'pdf' },
];
