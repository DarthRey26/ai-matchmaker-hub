import * as pdfjsLib from 'pdfjs-dist';
import nlp from 'compromise';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsLib.createWorkerURL();

export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument(uint8Array);
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

export async function extractStudentData(file) {
  const text = await extractTextFromPDF(file.path);
  return extractEntities(text, file.name);
}

export async function extractCompanyData(file) {
  const text = await extractTextFromPDF(file.path);
  return extractDataFromText(text);
}
