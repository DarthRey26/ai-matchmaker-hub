const { workerData, parentPort } = require('worker_threads');
const fs = require('fs').promises;
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

async function processFile(filePath) {
  const fileContent = await fs.readFile(filePath);
  const fileExtension = filePath.split('.').pop().toLowerCase();

  let text;
  if (fileExtension === 'pdf') {
    const pdfData = await pdf(fileContent);
    text = pdfData.text;
  } else if (fileExtension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: fileContent });
    text = result.value;
  } else {
    throw new Error('Unsupported file type');
  }

  // Perform analysis on the text
  const wordCount = text.split(/\s+/).length;

  return {
    filePath,
    wordCount,
    // Add more analysis results here
  };
}

processFile(workerData.filePath)
  .then(result => parentPort.postMessage(result))
  .catch(error => parentPort.postMessage({ error: error.message }));
