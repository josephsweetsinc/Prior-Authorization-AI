import { type MediaItem } from '@/shared/components';
import { toAbs } from '@/shared/lib/utils';

import { type IFile } from '../types/types';

export const apiFileToMediaItem = (file: IFile): MediaItem => {
  return {
    id: file.id,
    name: file.filename,
    filename: file.filename,
    size: file.file_size,
    file_size: file.file_size,
    content_type: file.content_type,
    file_url: file.file_url,
    url: toAbs(file.file_url),
  };
};

export const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null) {
    return '';
  }
  const mb = bytes / (1024 * 1024);
  if (mb >= 0.1) {
    return `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  if (kb < 1) {
    return '< 1 KB';
  }
  return `${Math.round(kb)} KB`;
};
