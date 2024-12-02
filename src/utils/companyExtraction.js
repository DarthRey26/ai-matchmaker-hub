import * as fs from 'fs';
import path from 'path';

function cleanFileName(filename) {
  // Remove timestamp prefix and file extension
  return filename
    .replace(/^\d+-/, '') // Remove timestamp
    .replace(/\.pdf$/, '') // Remove .pdf extension
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
}

function extractCompanyNameFromFilename(filename) {
  const cleanName = cleanFileName(filename);
  const parts = cleanName.split(/[_\s-]/);
  
  // The company name is typically before the underscore or dash
  if (parts[0]) {
    return parts[0]
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .trim();
  }
  
  return 'Unknown Company';
}

function extractRoleFromFilename(filename) {
  const cleanName = cleanFileName(filename);
  
  // Get everything after the company name
  const roleMatch = cleanName.match(/[^_\s-]+(?:[_\s-]+[^_\s-]+)*$/);
  if (roleMatch) {
    return roleMatch[0]
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .trim();
  }
  
  return 'Role Not Specified';
}

function formatStudentName(filename) {
  return filename
    .replace(/^\d+-/, '') // Remove timestamp
    .replace(/\.pdf$/, '') // Remove .pdf extension
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/Resume/gi, '') // Remove "Resume" word
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

export async function processCompanyPDFs(directory) {
  try {
    const files = fs.readdirSync(directory);
    const supportedFiles = files.filter(file => 
      file.toLowerCase().endsWith('.pdf')
    );

    const allCompanies = [];

    for (const file of supportedFiles) {
      const companyName = extractCompanyNameFromFilename(file);
      const role = extractRoleFromFilename(file);
      
      allCompanies.push({
        company_name: companyName,
        role: role,
        pdfName: file,
        requirements: [], // Will be populated by text extraction later
        job_descriptions: [] // Will be populated by text extraction later
      });
    }

    return allCompanies;
  } catch (error) {
    console.error('Error processing company documents:', error);
    return [];
  }
}

export { formatStudentName };