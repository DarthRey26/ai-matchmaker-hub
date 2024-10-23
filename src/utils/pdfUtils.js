import { extractDataFromPDF } from './dataExtractor';

export async function processMultiplePDFs(files) {
  const processedData = await Promise.all(files.map(async (file) => {
    const text = await extractDataFromPDF(file);
    return { name: file.name, text };
  }));
  return processedData;
}
