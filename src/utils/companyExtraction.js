import * as fs from 'fs';
import path from 'path';
import nlp from 'compromise';

function extractCompanyInfo(content, filename) {
  const info = {};
  
  // Extract company name from filename first as fallback
  const filenameParts = path.basename(filename, '.pdf').split('_');
  info.company_name = filenameParts[0].replace(/-/g, ' ').trim();
  
  // Try to extract from content with improved patterns
  const companyNamePatterns = [
    /company\s*name\s*:?\s*([^:\n]+?)(?=\s*(?:company website|brief company description|$))/i,
    /^([^:\n]+?)\s*(?:company website|brief company description)/i,
    /([^:\n]+?)\s*brief company description/i
  ];

  for (const pattern of companyNamePatterns) {
    const match = content.match(pattern);
    if (match) {
      info.company_name = match[1].trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      break;
    }
  }

  // Extract role/position
  const rolePatterns = [
    /position\s*:?\s*([^:\n]+)/i,
    /job\s*title\s*:?\s*([^:\n]+)/i,
    /role\s*:?\s*([^:\n]+)/i
  ];

  for (const pattern of rolePatterns) {
    const match = content.match(pattern);
    if (match) {
      info.role = match[1].trim();
      break;
    }
  }

  // If no role found in content, try to extract from filename
  if (!info.role && filenameParts.length > 1) {
    info.role = filenameParts.slice(1).join(' ').replace(/-/g, ' ').trim();
  }

  // Extract job descriptions with improved parsing
  const jobDescriptionSection = content.match(/job\s*description\s*\(?s?\)?:?\s*([^]*?)(?=internship requirement|additional note|$)/i);
  if (jobDescriptionSection) {
    const jobDescText = jobDescriptionSection[1];
    info.job_descriptions = jobDescText
      .split(/(?=●|\d+\.)/)
      .filter(desc => desc.trim())
      .map(desc => ({
        description: desc.replace(/^[●\d\.]\s*/, '').trim()
      }));
  }

  // Extract requirements with better structure
  const requirementsSection = content.match(/(?:internship\s*requirement|requirements|qualifications)\s*\(?s?\)?:?\s*([^]*?)(?=additional note|benefits|$)/i);
  if (requirementsSection) {
    info.requirements = requirementsSection[1]
      .split(/(?=●|\d+\.)/)
      .filter(req => req.trim())
      .map(req => req.replace(/^[●\d\.]\s*/, '').trim());
  }

  return info;
}

export async function processCompanyPDFs(directory) {
  try {
    const files = fs.readdirSync(directory);
    const supportedFiles = files.filter(file => 
      file.toLowerCase().endsWith('.pdf') || 
      file.toLowerCase().endsWith('.txt')
    );

    const allCompanies = [];

    for (const file of supportedFiles) {
      const filePath = path.join(directory, file);
      const text = await extractTextFromPDF(filePath);
      const companyInfo = extractCompanyInfo(text, file);
      allCompanies.push(companyInfo);
    }

    return allCompanies;
  } catch (error) {
    console.error('Error processing company documents:', error);
    return [];
  }
}