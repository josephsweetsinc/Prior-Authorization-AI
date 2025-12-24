'use client';

import { X, Loader2, Upload, Download } from 'lucide-react';
import React, { type ChangeEvent, type DragEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { useUploadMedia } from '@/services';
import { useApiFormError } from '@/shared/hooks/useApiFormError';
import { cn, toAbs } from '@/shared/lib/utils';

export type MediaItem = {
  id: number;
  url?: string;
  name?: string;
  size?: number;
  filename?: string;
  file_size?: number;
};

type Props = {
  multiple?: boolean;
  value: MediaItem[];
  onChangeAction: (_media: MediaItem[]) => void;
  uploadType?: string;
  className?: string;
  dropAreaClassName?: string;
  maxSizeMB?: number;
};

export const Uploader = ({
  multiple = false,
  value,
  onChangeAction,
  uploadType = 'logo',
  className,
  dropAreaClassName,
  maxSizeMB = 5,
}: Props) => {
  const { uploadFile, isLoading: isUploading } = useUploadMedia();

  const { handleError } = useApiFormError();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isLoading = isUploading || isProcessing;

  const normalizeUrl = (u?: string) => (u ? toAbs(u) : '');

  const formatFileSize = (bytes?: number) => {
    if (!bytes && bytes !== 0) {
      return '';
    }
    const mb = bytes / (1024 * 1024);
    if (mb < 0.1) {
      return '< 0.1 MB';
    }
    return `${mb.toFixed(1)} MB`;
  };

  const getFileName = (item: MediaItem) => {
    return (
      item.name || item.filename || item.url?.split('/').pop() || 'Unknown file'
    );
  };

  const getFileSize = (item: MediaItem) => {
    return item.size ?? item.file_size;
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File "${file.name}" exceeds ${maxSizeMB}MB.`);
      return false;
    }

    const allowedExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    const name = file.name || '';
    const extMatch = name.toLowerCase().match(/\.([a-z0-9]+)$/);
    const ext = extMatch ? extMatch[1] : '';

    if (!allowedExt.includes(ext)) {
      toast.error(
        `File "${file.name}" has unsupported format. Allowed: PDF, DOC, DOCX, XLS, XLSX.`,
      );
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    const filesToProcess = multiple ? fileArray : [fileArray[0]];

    setIsProcessing(true);

    const nextMedia: MediaItem[] = multiple ? [...value] : [];

    for (const file of filesToProcess) {
      if (!validateFile(file)) {
        continue;
      }

      try {
        const { url } = await uploadFile(file, uploadType);

        const absUrl = normalizeUrl(url);
        const tempId = Date.now() + Math.random();

        nextMedia.push({
          id: tempId,
          url: absUrl,
          name: file.name,
          size: file.size,
        });
      } catch (error) {
        handleError(error);
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

  const removeImage = (id: number) => {
    onChangeAction(value.filter((item) => item.id !== id));
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <label
        className={cn(
          'relative flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition-all duration-200',
          'border-[#047CB4] bg-transparent',
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
            <div className='flex flex-col items-center gap-2 text-blue-600'>
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
              <p className='text-sm font-semibold text-[#4A5568]'>
                <span className='text-[#047CB4] hover:underline'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className='text-xs text-[#4A5568]'>
                PDF, DOC, DOCX, XLS, XLSX (max {maxSizeMB}MB)
              </p>
              <div className='mt-4 rounded-lg border border-[#047CB4] bg-white px-6 py-2.5 text-sm font-medium text-[#047CB4] shadow-sm transition-colors hover:bg-blue-50'>
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

            return (
              <div
                key={item.id}
                className='flex cursor-pointer items-center justify-between rounded-[8px] bg-[rgba(4,124,180,0.05)] p-4 transition-colors hover:bg-blue-50/50'
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
                  {item.url && (
                    <a
                      href={toAbs(item.url)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group flex h-8 w-8 items-center justify-center rounded-full text-[#047CB4] transition-colors hover:bg-blue-100'
                      title='Download'
                    >
                      <Download size={18} strokeWidth={2} />
                    </a>
                  )}

                  <button
                    type='button'
                    onClick={() => removeImage(item.id)}
                    className='group flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500'
                    title='Remove'
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
