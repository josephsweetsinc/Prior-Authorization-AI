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
