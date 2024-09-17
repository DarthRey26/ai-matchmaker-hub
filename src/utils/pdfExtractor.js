import JSZip from 'jszip';
import pdfParse from 'pdf-parse';

export const extractCompanyInfo = async (zipFile) => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(zipFile);
  const companies = [];

  for (const [filename, file] of Object.entries(contents.files)) {
    if (filename.endsWith('.pdf')) {
      const pdfContent = await file.async('arraybuffer');
      const pdfData = await pdfParse(pdfContent);
      const text = pdfData.text;

      const companyInfo = {
        name: extractCompanyName(text),
        description: extractBriefDescription(text),
        jobDescription: extractJobDescription(text),
      };

      companies.push(companyInfo);
    }
  }

  return companies;
};

const extractCompanyName = (text) => {
  // This is a simple extraction. You might need to adjust based on your PDF structure
  const nameMatch = text.match(/Company Name:\s*(.*)/i);
  return nameMatch ? nameMatch[1].trim() : 'Unknown Company';
};

const extractBriefDescription = (text) => {
  // Adjust this regex based on how the brief description is formatted in your PDFs
  const descMatch = text.match(/Company Description:\s*((?:(?!\n\n).)*)/s);
  return descMatch ? descMatch[1].trim() : 'No description available.';
};

const extractJobDescription = (text) => {
  // Adjust this regex based on how the job description is formatted in your PDFs
  const jobDescMatch = text.match(/Job Description:\s*((?:(?!\n\n).)*)/s);
  return jobDescMatch ? jobDescMatch[1].trim() : 'No job description available.';
};