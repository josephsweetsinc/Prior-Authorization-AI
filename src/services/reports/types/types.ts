export type ReportFileFormat = 'pdf' | 'excel';

export interface IReport {
  id: number;
  name: string;
  format: ReportFileFormat;
  created_at: string;
  created_by_full_name: string;
  download_url: string;
}

export interface IReportStats {
  total_requests: number;
  total_requests_change: number;
  approved_requests: number;
  approved_requests_change: number;
  denied_requests: number;
  denied_requests_change: number;
  pending_requests: number;
  pending_requests_change: number;
}

export interface ILatestReports {
  reports: IReport[];
  current_statistics: IReportStats;
}

export interface IGenerateReportParams {
  format: ReportFileFormat;
  start_date: string;
  end_date: string;
}

export interface IGenerateReportResponse {
  report_id: 0;
  download_url: string;
}
