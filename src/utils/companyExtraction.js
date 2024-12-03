import * as fs from 'fs';
import path from 'path';

export function extractCompanyInfo(content) {
  const info = {};
  
  // Extract company name
  const companyNameMatch = content.match(/Company\s*Name\s*:\s*([^\n]+)/i);
  info.company_name = companyNameMatch ? companyNameMatch[1].trim() : 'Company Name Not Found';
  
  // Extract role from Job Description
  const jobDescriptionMatch = content.match(/Job\s*Description\s*\(?s?\)?:\s*([^]*?)(?=Internship\s*Requirement|$)/i);
  if (jobDescriptionMatch) {
    const jobDesc = jobDescriptionMatch[1].trim();
    // Usually the role is mentioned in the first line or title
    const firstLine = jobDesc.split('\n')[0];
    info.role = firstLine.replace(/^\d+\.\s*/, '').trim() || 'Role Not Specified';
  } else {
    info.role = 'Role Not Specified';
  }

  // Extract other fields
  const websiteMatch = content.match(/Company\s*Website\s*:\s*([^\n]+)/i);
  info.website = websiteMatch ? websiteMatch[1].trim() : '';

  const hoursMatch = content.match(/Hours\s*of\s*Work\s*:\s*([^\n]+)/i);
  info.working_hours = hoursMatch ? hoursMatch[1].trim() : '';

  const daysMatch = content.match(/Working\s*Days:\s*([^\n]+)/i);
  info.working_days = daysMatch ? daysMatch[1].trim() : '';

  const allowanceMatch = content.match(/Monthly\s*Allowance:\s*([^\n]+)/i);
  info.monthly_allowance = allowanceMatch ? allowanceMatch[1].trim() : '';

  // Extract requirements
  const requirementsMatch = content.match(/Internship\s*Requirement\s*\(?s?\)?:\s*([^]*?)(?=\s*$)/i);
  if (requirementsMatch) {
    info.requirements = requirementsMatch[1]
      .split(/[•\n]/)
      .map(req => req.trim())
      .filter(req => req.length > 0);
  } else {
    info.requirements = [];
  }

  return info;
}

export function formatStudentName(filename) {
  return filename
    .replace(/^\d+-/, '') // Remove timestamp
    .replace(/\.pdf$/, '') // Remove .pdf extension
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/Resume/gi, '') // Remove "Resume" word
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}