'use client';

import { X, Loader2, Upload, Download } from 'lucide-react';
import React, { type ChangeEvent, type DragEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { useUploadMedia } from '@/services';
import { Modal } from '@/shared/components';
import { useApiFormError } from '@/shared/hooks/useApiFormError';
import { cn, toAbs } from '@/shared/lib/utils';

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
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const isLoading = isUploading || isProcessing;

  const normalizeUrl = (u?: string) => (u ? toAbs(u) : '');

  const resolveMediaItem = (raw: unknown): MediaItem => {
    if (!raw) {
      return { id: 0 } as MediaItem;
    }

    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return resolveMediaItem(parsed);
      } catch {
        return {
          id: 0,
          url: raw,
          name: raw.split('/').pop()?.split('?')[0],
        } as MediaItem;
      }
    }

    if (Array.isArray(raw) && raw.length > 0) {
      return resolveMediaItem(raw[0]);
    }

    const asRecord = (v: unknown): Record<string, unknown> | null =>
      v && typeof v === 'object' ? (v as Record<string, unknown>) : null;

    const r = asRecord(raw);
    if (!r) {
      return { id: 0 } as MediaItem;
    }

    const hasRootData =
      Boolean(r.file_url) ||
      Boolean(r.url) ||
      Boolean(r.fileUrl) ||
      Boolean(r.filename);
    if (!hasRootData && r.file && typeof r.file === 'object') {
      return resolveMediaItem(r.file);
    }

    if (!hasRootData && Array.isArray(r.files) && r.files.length > 0) {
      return resolveMediaItem(r.files[0]);
    }

    const rawUrl =
      (r.file_url as string) ||
      (r.fileUrl as string) ||
      (r.url as string) ||
      (r.fileURL as string) ||
      (r.file && (r.file as Record<string, unknown>).file_url) ||
      (r.file && (r.file as Record<string, unknown>).url) ||
      '';

    const filename =
      (r.filename as string) ||
      (r.name as string) ||
      (r.file_name as string) ||
      (r.original_name as string) ||
      '';

    const sizeVal = r.size ?? r.file_size ?? r.fileSize;

    const idVal = r.id ?? (r.uid ? Number(r.uid) : undefined);

    const finalUrl = normalizeUrl(rawUrl as string | undefined);

    if (!rawUrl) {
      console.warn('Warning: No URL found in item:', raw);
    }

    let id = 0;
    if (typeof idVal === 'string' && String(idVal).match(/^\d+$/)) {
      id = parseInt(String(idVal), 10);
    } else if (typeof idVal === 'number') {
      id = idVal;
    }

    return {
      id,
      url: finalUrl,
      file_url: rawUrl as string | undefined,
      name: filename,
      filename: filename,
      size: sizeVal ? Number(sizeVal) : undefined,
      file_size: sizeVal ? Number(sizeVal) : undefined,
      content_type:
        (r.content_type as string) ||
        (r.contentType as string) ||
        (r.mimetype as string),
    } as MediaItem;
  };

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

  const getFileName = (item?: MediaItem | null) => {
    if (!item) {
      return 'Unknown file';
    }
    if (item.name) {
      return item.name;
    }
    if (item.filename) {
      return item.filename;
    }
    const url = item.file_url ?? item.url;
    if (url) {
      try {
        const parsed = url.split('?')[0];
        return parsed.split('/').pop() || 'Unknown file';
      } catch {
        return 'Unknown file';
      }
    }
    return 'Unknown file';
  };

  const getFileSize = (item?: MediaItem | null) => {
    if (!item) {
      return undefined;
    }
    return item.size ?? item.file_size;
  };

  const getFileUrl = (item?: MediaItem | null) => {
    if (!item) {
      return '';
    }
    const raw = item.url ?? item.file_url ?? '';
    return normalizeUrl(raw || undefined);
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
        const response = await uploadFile(file, uploadType);

        let data: unknown = response;
        if (Array.isArray(response) && response.length > 0) {
          data = response[0];
        }

        const asRecord = (v: unknown): Record<string, unknown> | null =>
          v && typeof v === 'object' ? (v as Record<string, unknown>) : null;

        const rec = asRecord(data);

        const serverUrl = rec?.file_url ?? rec?.url ?? rec?.fileUrl ?? '';
        const serverId = rec?.id;
        const serverFilename = rec?.filename ?? rec?.name ?? file.name;
        const serverFileSize = rec?.file_size ?? rec?.size ?? file.size;
        const serverContentType =
          rec?.content_type ?? rec?.contentType ?? file.type;

        const absUrl = normalizeUrl(serverUrl as string | undefined);

        let finalId: number;
        if (typeof serverId === 'number') {
          finalId = serverId;
        } else if (
          serverId &&
          typeof serverId === 'string' &&
          serverId.match(/^\d+$/)
        ) {
          finalId = Number(serverId);
        } else {
          finalId = Date.now();
        }

        nextMedia.push({
          id: finalId,
          url: absUrl,
          file_url: serverUrl as string | undefined,
          name: (serverFilename as string) || file.name,
          size: serverFileSize ? Number(serverFileSize) : file.size,
          content_type: (serverContentType as string) || file.type,
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

  const removeImage = (id: number | string) => {
    onChangeAction(value.filter((item) => String(item.id) !== String(id)));
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
            const resolved = resolveMediaItem(item as unknown);
            const fileName = getFileName(resolved);
            const fileSizeFormatted = formatFileSize(getFileSize(resolved));
            const fileUrl = getFileUrl(resolved);

            return (
              <div
                key={String(resolved.id)}
                onClick={() => setPreviewItem(resolved)}
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
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                      download
                      className='group flex h-8 w-8 items-center justify-center rounded-full text-[#047CB4] transition-colors hover:bg-blue-100'
                      title='Download'
                    >
                      <Download color='#047CB4' strokeWidth={1.5} />
                    </a>
                  )}

                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(resolved.id);
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
        className='w-[800px]'
        onCloseAction={() => setPreviewItem(null)}
      >
        <div className='mt-4'>
          <div className='mb-4 text-[24px] font-semibold text-[#232323]'>
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
                    className='rounded-md border border-[#047CB4] bg-white px-3 py-1 text-sm font-medium text-[#047CB4]'
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
