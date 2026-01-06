# PDF Merger

A modern web application to merge multiple PDFs and images into a single PDF document. Built with Next.js and TypeScript.

## Features

- **Multi-format Support**: Upload PDF, PNG, and JPG/JPEG files
- **Drag & Drop**: Easily reorder files by dragging them
- **Rotate Pages**: Rotate individual files 90° clockwise or counter-clockwise
- **Visual Previews**: See thumbnails of all uploaded files
- **Privacy First**: All processing happens client-side - your files never leave your device
- **No Backend Required**: Runs entirely in the browser

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **pdf-lib** - PDF manipulation
- **pdfjs-dist** - PDF preview rendering
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload files** - Drag and drop files onto the upload zone or click to browse
2. **Arrange order** - Drag files to reorder them
3. **Rotate if needed** - Use the rotation buttons on each file card
4. **Merge** - Click "Merge X files" to combine and download your PDF

## Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryan-tng/PDFMerger)

## License

MIT
