import * as fs from 'fs';
import path from 'path';
import { 
  cleanText, 
  normalizeText, 
  removeExtraInformation, 
  extractListItems,
  standardizeCompanyName,
  extractRole
} from './textCleaningUtils.js';

function extractCompanyInfo(content, filename) {
  const info = {
    company_name: '',
    role: '',
    requirements: [],
    job_descriptions: [],
    additional_info: {}
  };
  
  // Extract company name and role
  info.company_name = standardizeCompanyName(filename, content);
  info.role = extractRole(filename, content);
  
  // Extract job descriptions with improved parsing
  const jobDescriptionSection = content.match(/job\s*description\s*:?\s*([^]*?)(?=requirements|qualifications|about us|$)/i);
  if (jobDescriptionSection) {
    info.job_descriptions = extractListItems(jobDescriptionSection[1])
      .map(desc => ({
        description: removeExtraInformation(desc)
      }));
  }

  // Extract requirements with better structure
  const requirementPatterns = [
    /requirements\s*:?\s*([^]*?)(?=benefits|additional|$)/i,
    /qualifications\s*:?\s*([^]*?)(?=benefits|additional|$)/i,
    /what\s*we\s*need\s*:?\s*([^]*?)(?=benefits|additional|$)/i
  ];

  for (const pattern of requirementPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      info.requirements = extractListItems(match[1])
        .map(req => removeExtraInformation(req));
      break;
    }
  }

  // Extract additional information
  const additionalPatterns = {
    working_hours: /(?:working|office)\s*hours\s*:?\s*([^:\n]+)/i,
    location: /(?:location|workplace)\s*:?\s*([^:\n]+)/i,
    salary: /(?:salary|compensation|allowance)\s*:?\s*([^:\n]+)/i
  };

  Object.entries(additionalPatterns).forEach(([key, pattern]) => {
    const match = content.match(pattern);
    if (match && match[1]) {
      info.additional_info[key] = cleanText(match[1]);
    }
  });

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
    const processedCompanies = new Map();

    for (const file of supportedFiles) {
      const filePath = path.join(directory, file);
      const text = await fs.promises.readFile(filePath, 'utf8');
      const companyInfo = extractCompanyInfo(text, file);

      // Group by company name to handle multiple roles
      if (processedCompanies.has(companyInfo.company_name)) {
        const existing = processedCompanies.get(companyInfo.company_name);
        existing.roles = existing.roles || [];
        existing.roles.push({
          title: companyInfo.role,
          requirements: companyInfo.requirements,
          job_descriptions: companyInfo.job_descriptions,
          additional_info: companyInfo.additional_info
        });
      } else {
        processedCompanies.set(companyInfo.company_name, {
          ...companyInfo,
          roles: [{
            title: companyInfo.role,
            requirements: companyInfo.requirements,
            job_descriptions: companyInfo.job_descriptions,
            additional_info: companyInfo.additional_info
          }]
        });
      }
    }

    return Array.from(processedCompanies.values());
  } catch (error) {
    console.error('Error processing company documents:', error);
    return [];
  }
}