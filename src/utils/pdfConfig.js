import { GlobalWorkerOptions } from 'pdfjs-dist';

export function configurePDFWorker() {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.version}/pdf.worker.min.js`;
  
  // Configure font paths
  GlobalWorkerOptions.standardFontDataUrl = 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/';
}