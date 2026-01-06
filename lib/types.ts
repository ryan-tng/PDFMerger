export interface FileItem {
  id: string;
  file: File;
  name: string;
  type: 'pdf' | 'image';
  preview: string;
  rotation: number; // 0, 90, 180, 270
}

export type FileType = 'pdf' | 'image';

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

export const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];

