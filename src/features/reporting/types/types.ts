export type ReportFormat = 'pdf' | 'xlsx' | 'csv';

export interface IMetric {
  metric: string;
  value: string;
  change: number;
}

export interface IRecentReport {
  name: string;
  generatedBy: string;
  format: ReportFormat;
  date: string;
  link: string;
}
