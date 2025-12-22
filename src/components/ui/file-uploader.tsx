'use client';

import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  onFilesSelected,
  maxFiles = 1,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
  },
  disabled = false,
  className,
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }

      if (fileRejections.length > 0) {
        console.warn('Files rejected:', fileRejections);
        // Could trigger a toast here
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="p-2 rounded-full bg-muted">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isDragActive
              ? 'Drop files here'
              : 'Drag & drop files here or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, Images, Word, Excel (Max details handled by
            caller)
          </p>
        </div>
      </div>
    </div>
  );
}
