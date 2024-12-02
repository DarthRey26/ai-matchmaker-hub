import * as fs from 'fs';
import path from 'path';

function extractCompanyNameFromFilename(filename) {
  // Remove timestamp prefix and file extension
  const nameWithoutTimestamp = filename.replace(/^\d+-/, '');
  const nameWithoutExtension = nameWithoutTimestamp.replace(/\.pdf$/, '');
  
  // Split by underscore or dash
  const parts = nameWithoutExtension.split(/[_-]/);
  
  // The company name is typically the first part
  if (parts[0]) {
    return parts[0].trim()
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .trim();
  }
  
  return 'Unknown Company';
}

function extractRoleFromFilename(filename) {
  const nameWithoutTimestamp = filename.replace(/^\d+-/, '');
  const nameWithoutExtension = nameWithoutTimestamp.replace(/\.pdf$/, '');
  
  // Split by underscore or dash, take everything after company name
  const parts = nameWithoutExtension.split(/[_-]/);
  if (parts.length > 1) {
    return parts.slice(1).join(' ')
      .replace(/_/g, ' ')
      .trim();
  }
  
  return 'Unknown Role';
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