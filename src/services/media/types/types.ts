import { type MediaItem } from '@/shared/components';

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

export interface IUploadAndExtractionResult extends IExtractedData {
  files: MediaItem[];
}
