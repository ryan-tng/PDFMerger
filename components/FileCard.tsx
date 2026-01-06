'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, RotateCcw, Trash2, GripVertical, FileText } from 'lucide-react';
import { FileItem } from '@/lib/types';

interface FileCardProps {
  file: FileItem;
  index: number;
  onRotate: (id: string, direction: 'cw' | 'ccw') => void;
  onRemove: (id: string) => void;
}

export default function FileCard({ file, index, onRotate, onRemove }: FileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden
        border border-slate-700/50 transition-all duration-200
        ${isDragging ? 'z-50 shadow-2xl shadow-cyan-500/20 scale-105' : 'hover:border-slate-600'}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg 
                   cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>

      {/* Order Badge */}
      <div className="absolute top-2 right-2 z-10 px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 
                      rounded-full text-xs font-bold text-white shadow-lg">
        {index + 1}
      </div>

      {/* Preview */}
      <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-contain transition-transform duration-300"
            style={{ transform: `rotate(${file.rotation}deg)` }}
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center gap-2 transition-transform duration-300"
            style={{ transform: `rotate(${file.rotation}deg)` }}
          >
            <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl">
              <FileText className="w-10 h-10 text-red-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">PDF</span>
          </div>
        )}
        
        {/* Rotation Indicator */}
        {file.rotation !== 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm 
                          rounded text-xs text-slate-400">
            {file.rotation}°
          </div>
        )}
      </div>

      {/* File Info & Controls */}
      <div className="p-3">
        <p className="text-sm text-slate-300 truncate mb-3" title={file.name}>
          {file.name}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onRotate(file.id, 'ccw')}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 
                         hover:text-slate-200 transition-colors"
              title="Rotate counter-clockwise"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRotate(file.id, 'cw')}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-400 
                         hover:text-slate-200 transition-colors"
              title="Rotate clockwise"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(file.id)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 
                       hover:text-red-300 transition-colors"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

