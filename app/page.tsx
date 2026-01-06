'use client';

import { useState, useCallback } from 'react';
import { FileStack, Github } from 'lucide-react';
import FileUploader from '@/components/FileUploader';
import FileList from '@/components/FileList';
import MergeButton from '@/components/MergeButton';
import { FileItem } from '@/lib/types';
import { generatePreview, mergeFiles, downloadPdf, generateId, getFileType } from '@/lib/pdf-utils';

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesAdded = useCallback(async (newFiles: File[]) => {
    const fileItems: FileItem[] = await Promise.all(
      newFiles.map(async (file) => {
        const preview = await generatePreview(file);
        return {
          id: generateId(),
          file,
          name: file.name,
          type: getFileType(file),
          preview,
          rotation: 0,
        };
      })
    );
    
    setFiles((prev) => [...prev, ...fileItems]);
  }, []);

  const handleReorder = useCallback((reorderedFiles: FileItem[]) => {
    setFiles(reorderedFiles);
  }, []);

  const handleRotate = useCallback((id: string, direction: 'cw' | 'ccw') => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === id) {
          const delta = direction === 'cw' ? 90 : -90;
          const newRotation = (file.rotation + delta + 360) % 360;
          return { ...file, rotation: newRotation };
        }
        return file;
      })
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find(f => f.id === id);
      if (file?.preview && file.type === 'image') {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    try {
      const pdfBytes = await mergeFiles(files);
      downloadPdf(pdfBytes, 'merged-document.pdf');
    } catch (error) {
      console.error('Error merging files:', error);
      alert('An error occurred while merging files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [files]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI1MmUiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                  <FileStack className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">PDF Merge</h1>
                  <p className="text-xs text-slate-500">Combine files with ease</p>
                </div>
              </div>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Merge PDFs & Images
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Into One Document
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upload your files, arrange them in any order, rotate as needed, 
              and download a perfectly merged PDF.
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <FileUploader onFilesAdded={handleFilesAdded} disabled={isProcessing} />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Your Files
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({files.length} {files.length === 1 ? 'file' : 'files'})
                  </span>
                </h3>
                <p className="text-sm text-slate-500">
                  Drag to reorder • Click arrows to rotate
                </p>
              </div>
              
              <FileList
                files={files}
                onReorder={handleReorder}
                onRotate={handleRotate}
                onRemove={handleRemove}
              />
            </div>
          )}

          {/* Merge Button */}
          <div className="flex justify-center">
            <MergeButton
              fileCount={files.length}
              isProcessing={isProcessing}
              onMerge={handleMerge}
            />
          </div>

          {/* Features */}
          {files.length === 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Multiple Formats',
                  description: 'Support for PDF, PNG, and JPG files all merged into one document.',
                },
                {
                  title: 'Drag & Drop',
                  description: 'Easily reorder your files by dragging them to the desired position.',
                },
                {
                  title: 'Rotate Pages',
                  description: 'Rotate individual files 90° clockwise or counter-clockwise.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center">
            <p className="text-sm text-slate-600">
              All processing happens in your browser. Your files are never uploaded to any server.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
