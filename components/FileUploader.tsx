'use client';

import { useCallback } from 'react';
import { Upload, FileImage, FileText } from 'lucide-react';
import { ACCEPTED_EXTENSIONS } from '@/lib/types';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export default function FileUploader({ onFilesAdded, disabled }: FileUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (disabled) return;
      
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        return ACCEPTED_EXTENSIONS.includes(ext);
      });
      
      if (droppedFiles.length > 0) {
        onFilesAdded(droppedFiles);
      }
    },
    [onFilesAdded, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        onFilesAdded(Array.from(selectedFiles));
      }
      // Reset input value so same file can be selected again
      e.target.value = '';
    },
    [onFilesAdded, disabled]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center
        transition-all duration-300 ease-out
        ${disabled 
          ? 'border-slate-700 bg-slate-900/30 cursor-not-allowed' 
          : 'border-slate-600 bg-slate-900/50 hover:border-cyan-500 hover:bg-slate-800/50 cursor-pointer'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl">
            <Upload className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        
        <div>
          <p className="text-lg font-medium text-slate-200">
            Drop files here or click to browse
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Supports PDF, PNG, JPG files
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText className="w-4 h-4" />
            <span className="text-xs">PDF</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <FileImage className="w-4 h-4" />
            <span className="text-xs">PNG / JPG</span>
          </div>
        </div>
      </div>
    </div>
  );
}

