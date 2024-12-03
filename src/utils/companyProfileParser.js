import * as fs from 'fs';
import path from 'path';

export const parseCompanyProfile = (content) => {
  const info = {};
  
  // Extract company name
  const companyNameMatch = content.match(/Company\s*Name\s*:\s*([^\n]+)/i);
  if (companyNameMatch) {
    info.company_name = companyNameMatch[1].trim();
  }

  // Extract website
  const websiteMatch = content.match(/Company\s*Website\s*:\s*([^\n]+)/i);
  if (websiteMatch) {
    info.website = websiteMatch[1].trim();
  }

  // Extract working hours
  const hoursMatch = content.match(/Hours\s*of\s*Work\s*:\s*([^\n]+)/i);
  if (hoursMatch) {
    info.working_hours = hoursMatch[1].trim();
  }

  // Extract working days
  const daysMatch = content.match(/Working\s*Days\s*:\s*([^\n]+)/i);
  if (daysMatch) {
    info.working_days = daysMatch[1].trim();
  }

  // Extract monthly allowance
  const allowanceMatch = content.match(/Monthly\s*Allowance\s*:\s*([^\n]+)/i);
  if (allowanceMatch) {
    info.monthly_allowance = allowanceMatch[1].trim();
  }

  // Extract job descriptions
  const jobDescriptionMatch = content.match(/Job\s*Description\s*\(?s?\)?:([^]*?)(?=Internship\s*Requirement|$)/i);
  if (jobDescriptionMatch) {
    const descriptions = jobDescriptionMatch[1]
      .split(/(?=•|\d+\.)/)
      .map(desc => desc.trim())
      .filter(desc => desc.length > 0);
    
    info.job_descriptions = descriptions;
    
    // Extract role from first job description
    if (descriptions[0]) {
      info.role = descriptions[0].replace(/^\d+\.\s*/, '').split('\n')[0].trim();
    }
  }

  // Extract requirements
  const requirementsMatch = content.match(/Internship\s*Requirement\s*\(?s?\)?:([^]*?)(?=\s*$)/i);
  if (requirementsMatch) {
    info.requirements = requirementsMatch[1]
      .split(/(?=•|\d+\.)/)
      .map(req => req.trim())
      .filter(req => req.length > 0);
  }

  return info;
};

export const processCompanyPDFs = async (directory) => {
  try {
    const files = fs.readdirSync(directory);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    const companies = [];
    
    for (const file of pdfFiles) {
      const filePath = path.join(directory, file);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const companyInfo = parseCompanyProfile(fileContent);
      
      companies.push({
        ...companyInfo,
        pdfName: file,
        filePath: filePath
      });
    }
    
    return companies;
  } catch (error) {
    console.error('Error processing company PDFs:', error);
    return [];
  }
};