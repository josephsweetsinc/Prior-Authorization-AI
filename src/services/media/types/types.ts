export interface IFile {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
  file_url: string;
}

export type IExtractionRequest = {
  file_ids: number[];
};

export type IExtractedData = {
  extracted_data?: Record<string, unknown> | null;
  is_complete?: boolean;
};
