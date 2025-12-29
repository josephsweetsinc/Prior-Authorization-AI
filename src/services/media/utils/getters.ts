import { type MediaItem } from '@/shared/components';

export const getFileName = (item?: MediaItem | null): string => {
  return (
    item?.name ??
    item?.filename ??
    item?.file_url?.split('?')[0].split('/').pop() ??
    'Unknown file'
  );
};

export const getFileSize = (item?: MediaItem | null): number | undefined => {
  return item?.size ?? item?.file_size;
};

export const getFileUrl = (item?: MediaItem | null): string => {
  return item?.url ?? '';
};
