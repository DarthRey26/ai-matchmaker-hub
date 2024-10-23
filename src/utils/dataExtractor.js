import * as pdfjs from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist/webpack';
import nlp from 'compromise';
import { extractTextFromPDF, extractDataFromText, extractEntities } from './advancedExtraction';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + ' ';
  }

  return fullText;
}

export async function extractStudentData(file) {
  const text = await extractTextFromPDF(file.path);
  return extractEntities(text, file.name);
}

export async function extractCompanyData(file) {
  const text = await extractTextFromPDF(file.path);
  return extractDataFromText(text);
}
