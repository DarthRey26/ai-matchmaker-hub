import * as fs from 'fs';
import path from 'path';
import pdfjsLib from 'pdfjs-dist';

// Initialize pdfjsLib
if (typeof window === 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(
    process.cwd(),
    'node_modules/pdfjs-dist/build/pdf.worker.js'
  );
}

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function formatStudentName(filename) {
  return filename
    .replace(/^\d+-/, '')
    .replace(/\.pdf$/, '')
    .replace(/_/g, ' ')
    .replace(/Resume/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function extractTextFromPDF(filePath) {
  try {
    const data = new Uint8Array(await fs.promises.readFile(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error(`Error extracting text from PDF ${filePath}:`, error);
    return '';
  }
}

function extractCompanyInfo(content) {
  const info = {};
  
  // Extract company name - more robust pattern
  const companyNameMatch = content.match(/Company\s*Name\s*:?\s*([^\n]+?)(?=Company\s*Website|Brief\s*Company|$)/i);
  info.company_name = companyNameMatch ? cleanText(companyNameMatch[1]) : '';

  // Extract job descriptions with bullet points
  const jobDescSection = content.match(/Job\s*Description\s*\(?s?\)?:?\s*([^]*?)(?=Internship\s*Requirement|$)/i);
  if (jobDescSection) {
    info.job_descriptions = jobDescSection[1]
      .split(/[•●\-\*]|\d+\./)
      .map(desc => cleanText(desc))
      .filter(desc => desc.length > 0)
      .map(desc => ({ description: desc }));
  } else {
    info.job_descriptions = [];
  }

  // Extract requirements with bullet points
  const reqSection = content.match(/Internship\s*Requirement\s*\(?s?\)?:?\s*([^]*?)(?=Additional\s*Note|$)/i);
  if (reqSection) {
    info.requirements = reqSection[1]
      .split(/[•●\-\*]|\d+\./)
      .map(req => cleanText(req))
      .filter(req => req.length > 0);
  } else {
    info.requirements = [];
  }

  return info;
}

async function processCompanyPDFs(directory) {
  try {
    const files = fs.readdirSync(directory);
    const supportedFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    const allCompanies = [];

    for (const file of supportedFiles) {
      const filePath = path.join(directory, file);
      console.log(`Processing file: ${file}`);

      const content = await extractTextFromPDF(filePath);
      if (!content) {
        console.error(`Failed to extract content from ${file}`);
        continue;
      }

      const info = extractCompanyInfo(content);
      console.log('Extracted info:', info); // Debug log

      // If company name wasn't found in content, extract from filename
      if (!info.company_name) {
        const cleanName = file
          .replace(/^\d+-/, '')
          .replace(/\.pdf$/, '')
          .split(/[_\s-]/)[0];
        info.company_name = cleanName;
      }

      allCompanies.push({
        ...info,
        pdfName: file,
        company_name: info.company_name || 'Unknown Company',
        role: info.role || 'Role Not Specified'
      });
    }

    return allCompanies;
  } catch (error) {
    console.error('Error processing company documents:', error);
    return [];
  }
}

export { processCompanyPDFs, formatStudentName, cleanText };