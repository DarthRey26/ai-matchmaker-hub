import { extractTextFromPDF, extractStudentData, extractCompanyData } from './dataExtractor';

export async function processPDF(file: File): Promise<any> {
  const text = await extractTextFromPDF(file);
  
  if (file.name.toLowerCase().includes('student')) {
    return extractStudentData(text);
  } else if (file.name.toLowerCase().includes('company')) {
    return extractCompanyData(text);
  } else {
    throw new Error('Unknown PDF type');
  }
}

export async function processMultiplePDFs(files: FileList): Promise<any[]> {
  const processedData = await Promise.all(
    Array.from(files).map(file => processPDF(file))
  );
  return processedData;
}