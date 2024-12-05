import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.worker.entry';

export function configurePDFWorker() {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${GlobalWorkerOptions.version}/pdf.worker.min.js`;
  GlobalWorkerOptions.standardFontDataUrl = `//cdn.jsdelivr.net/npm/pdfjs-dist@${GlobalWorkerOptions.version}/standard_fonts/`;
}