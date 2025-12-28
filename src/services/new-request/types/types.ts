export type ExtractionRequest = {
  file_ids: number[];
};

export type ExtractionResponse = {
  extracted_data?: Record<string, unknown> | null;
  is_complete?: boolean;
};
