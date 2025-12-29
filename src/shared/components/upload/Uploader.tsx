'use client';

import { X, Loader2, Upload, Download } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useState } from 'react';
import { toast } from 'react-toastify';

import {
  apiFileToMediaItem,
  type IExtractedData,
  getFileName,
  getFileSize,
  getFileUrl,
  validateFile,
  useUploadMedia,
} from '@/services/media';
import { Modal } from '@/shared/components';
import { useApiFormError } from '@/shared/hooks/useApiFormError';
import { cn } from '@/shared/lib/utils';

export type MediaItem = {
  id: number;
  url?: string;
  file_url?: string;
  name?: string;
  filename?: string;
  size?: number;
  file_size?: number;
  content_type?: string;
};

type Props = {
  multiple?: boolean;
  value: MediaItem[];
  onChangeAction: (_media: MediaItem[]) => void;
  // eslint-disable-next-line no-unused-vars
  onUploadComplete?: (result: IExtractedData | null) => void;
  uploadType?: string;
  className?: string;
  dropAreaClassName?: string;
  maxSizeMB?: number;
};

export const Uploader = ({
  multiple = false,
  value,
  onChangeAction,
  onUploadComplete,
  uploadType = 'logo',
  className,
  dropAreaClassName,
  maxSizeMB = 5,
}: Props) => {
  const { uploadFile, isLoading: isUploading } = useUploadMedia();

  const { handleError } = useApiFormError();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const isLoading = isUploading || isProcessing;

  const formatFileSize = (bytes?: number) => {
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

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const fileArray = multiple ? Array.from(files) : [files[0]];
    setIsProcessing(true);

    const nextMedia = multiple ? [...value] : [];

    for (const file of fileArray) {
      const validation = validateFile(file, maxSizeMB);
      if (!validation.ok) {
        toast.error(validation.error);
        continue;
      }

      try {
        const res = await uploadFile(file, uploadType);

        res.files.forEach((f) => {
          nextMedia.push(apiFileToMediaItem(f));
        });

        if (onUploadComplete) {
          onUploadComplete({
            extracted_data: res.extracted_data,
            is_complete: res.is_complete,
          });
        }
      } catch (err) {
        handleError(err);
      }
    }

    onChangeAction(multiple ? nextMedia : nextMedia.slice(-1));
    setIsProcessing(false);
    setIsDragOver(false);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const removeImage = (id: number | string) => {
    onChangeAction(value.filter((item) => String(item.id) !== String(id)));
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <label
        className={cn(
          'relative flex min-h-45 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition-all duration-200',
          'border-status-info bg-transparent',
          !isLoading && 'hover:border-blue-600 hover:bg-[#EFF6FF]',
          isDragOver &&
            'border-blue-600 bg-blue-50 ring-2 ring-blue-100 ring-offset-2',
          isLoading && 'cursor-wait opacity-70',
          dropAreaClassName,
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type='file'
          accept='application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/vnd.ms-excel,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx'
          multiple={multiple}
          onChange={onInputChange}
          hidden
          disabled={isLoading}
        />

        <div className='flex flex-col items-center gap-2 py-10 text-center'>
          {isLoading ? (
            <div className='flex flex-col items-center gap-2 py-13 text-blue-600'>
              <Loader2 className='animate-spin' size={40} />
              <span className='text-sm font-medium'>Uploading files...</span>
            </div>
          ) : (
            <>
              <Upload
                size={48}
                color='#047CB4'
                strokeWidth={1.5}
                className='mb-2'
              />
              <p className='text-gray-dark text-sm font-semibold'>
                <span className='text-status-info hover:underline'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className='text-gray-dark text-xs'>
                PDF, DOC, DOCX, XLS, XLSX (max {maxSizeMB}MB)
              </p>
              <div className='text-status-info mt-4 rounded-lg border border-[#047CB4] bg-white px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-blue-50'>
                Browse Files
              </div>
            </>
          )}
        </div>
      </label>

      {value.length > 0 && (
        <div className='flex flex-col gap-3'>
          {value.map((item) => {
            const fileName = getFileName(item);
            const fileSizeFormatted = formatFileSize(getFileSize(item));
            const fileUrl = getFileUrl(item);

            return (
              <div
                key={String(item.id)}
                onClick={() => setPreviewItem(item)}
                className='flex cursor-pointer items-center justify-between rounded-xl bg-[rgba(4,124,180,0.05)] p-4 transition-colors hover:bg-blue-50/50'
              >
                <div className='flex flex-col gap-0.5 overflow-hidden'>
                  <p
                    className='truncate text-sm font-medium text-[#334155]'
                    title={fileName}
                  >
                    {fileName}
                  </p>
                  {fileSizeFormatted && (
                    <p className='text-xs text-[#64748B]'>
                      {fileSizeFormatted}
                    </p>
                  )}
                </div>

                <div className='ml-4 flex shrink-0 items-center gap-2'>
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      download
                      className='group text-status-info flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-blue-100'
                      title='Download'
                    >
                      <Download color='#047CB4' strokeWidth={1.5} />
                    </a>
                  )}

                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(item.id);
                    }}
                    className='group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500'
                    title='Remove'
                  >
                    <X color='#FE5C73' />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(previewItem)}
        className='w-200'
        onCloseAction={() => setPreviewItem(null)}
      >
        <div className='mt-4'>
          <div className='mb-4 text-[24px] font-semibold text-black'>
            {getFileName(previewItem)}
          </div>
          {(() => {
            const url = getFileUrl(previewItem);
            const ctype = previewItem?.content_type ?? '';
            const isPdf =
              ctype.includes('pdf') || url.toLowerCase().endsWith('.pdf');
            if (isPdf && url) {
              return (
                <object
                  data={url}
                  type='application/pdf'
                  width='100%'
                  height='600px'
                >
                  <p className='text-sm text-[#64748B]'>
                    Preview not available. You can download the file using the
                    button above.
                  </p>
                </object>
              );
            }

            return (
              <div className='flex flex-col items-start gap-2'>
                <p className='text-sm text-[#334155]'>
                  Preview not available for this file type.
                </p>
                {url && (
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    download
                    className='text-status-info rounded-md border border-[#047CB4] bg-white px-3 py-1 text-sm font-medium'
                  >
                    Download
                  </a>
                )}
              </div>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};
