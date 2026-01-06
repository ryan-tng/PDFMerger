import { PDFDocument, degrees } from 'pdf-lib';
import { FileItem } from './types';

// Flag to track if we should attempt PDF previews
let pdfPreviewSupported = true;

/**
 * Generate a preview URL for a file
 */
export async function generatePreview(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    // For PDFs, try to render the first page, fallback to placeholder
    if (pdfPreviewSupported) {
      try {
        return await generatePdfPreview(file);
      } catch (error) {
        console.warn('PDF preview generation failed, using placeholder:', error);
        pdfPreviewSupported = false;
        return ''; // Empty string means use placeholder
      }
    }
    return ''; // Use placeholder
  } else {
    // For images, create an object URL
    return URL.createObjectURL(file);
  }
}

/**
 * Generate a preview for a PDF file using canvas
 */
async function generatePdfPreview(file: File): Promise<string> {
  // Load PDF.js dynamically for preview generation
  const pdfJS = await import('pdfjs-dist');
  
  // Set worker source - use unpkg which has proper CORS headers
  pdfJS.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfJS.version}/build/pdf.worker.min.mjs`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  
  const scale = 0.5;
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  
  await page.render({
    canvasContext: context,
    viewport: viewport,
    canvas: canvas,
  }).promise;
  
  return canvas.toDataURL('image/png');
}

/**
 * Merge multiple files into a single PDF
 */
export async function mergeFiles(files: FileItem[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (const fileItem of files) {
    if (fileItem.type === 'pdf') {
      await addPdfToDocument(mergedPdf, fileItem);
    } else {
      await addImageToDocument(mergedPdf, fileItem);
    }
  }
  
  return await mergedPdf.save();
}

/**
 * Add a PDF file to the merged document
 */
async function addPdfToDocument(mergedPdf: PDFDocument, fileItem: FileItem): Promise<void> {
  const arrayBuffer = await fileItem.file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageIndices = pdf.getPageIndices();
  const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
  
  for (const page of copiedPages) {
    // Apply rotation if needed
    if (fileItem.rotation !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + fileItem.rotation));
    }
    mergedPdf.addPage(page);
  }
}

/**
 * Add an image file to the merged document
 */
async function addImageToDocument(mergedPdf: PDFDocument, fileItem: FileItem): Promise<void> {
  const arrayBuffer = await fileItem.file.arrayBuffer();
  
  let image;
  if (fileItem.file.type === 'image/png') {
    image = await mergedPdf.embedPng(arrayBuffer);
  } else {
    image = await mergedPdf.embedJpg(arrayBuffer);
  }
  
  // Get image dimensions
  let { width, height } = image;
  
  // Swap dimensions for 90 or 270 degree rotation
  const isRotated90or270 = fileItem.rotation === 90 || fileItem.rotation === 270;
  if (isRotated90or270) {
    [width, height] = [height, width];
  }
  
  // Create a page with the image dimensions
  const page = mergedPdf.addPage([width, height]);
  
  // Calculate position and rotation
  let x = 0;
  let y = 0;
  let drawWidth = isRotated90or270 ? height : width;
  let drawHeight = isRotated90or270 ? width : height;
  
  // Adjust position based on rotation
  switch (fileItem.rotation) {
    case 90:
      x = width;
      y = 0;
      break;
    case 180:
      x = width;
      y = height;
      break;
    case 270:
      x = 0;
      y = height;
      break;
    default:
      x = 0;
      y = 0;
  }
  
  page.drawImage(image, {
    x,
    y,
    width: drawWidth,
    height: drawHeight,
    rotate: degrees(fileItem.rotation),
  });
}

/**
 * Download a PDF blob
 */
export function downloadPdf(pdfBytes: Uint8Array, filename: string = 'merged.pdf'): void {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determine file type from MIME type
 */
export function getFileType(file: File): 'pdf' | 'image' {
  return file.type === 'application/pdf' ? 'pdf' : 'image';
}
