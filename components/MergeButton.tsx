'use client';

import { Download, Loader2, Sparkles } from 'lucide-react';

interface MergeButtonProps {
  fileCount: number;
  isProcessing: boolean;
  onMerge: () => void;
}

export default function MergeButton({ fileCount, isProcessing, onMerge }: MergeButtonProps) {
  const isDisabled = fileCount < 2 || isProcessing;

  return (
    <button
      onClick={onMerge}
      disabled={isDisabled}
      className={`
        relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl
        font-semibold text-lg transition-all duration-300 ease-out
        ${isDisabled
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]'
        }
      `}
    >
      {/* Glow effect */}
      {!isDisabled && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
      )}
      
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Merging...</span>
        </>
      ) : (
        <>
          {fileCount >= 2 ? (
            <Sparkles className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>
            {fileCount < 2
              ? 'Add at least 2 files'
              : `Merge ${fileCount} files`}
          </span>
        </>
      )}
    </button>
  );
}

