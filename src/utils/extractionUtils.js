import { cleanAndNormalize } from './cleaningUtils';

export function extractInfo(content, type) {
  if (type === 'company') {
    return extractCompanyInfo(content);
  } else if (type === 'student') {
    return extractStudentInfo(content);
  }
}

function extractCompanyInfo(content) {
  const info = {};
  
  const companyNameMatch = content.match(/Company name\s*(.+)/);
  if (companyNameMatch) info.company_name = companyNameMatch[1].trim();
  
  const websiteMatch = content.match(/Company website\s*(.+)/);
  if (websiteMatch) info.website = websiteMatch[1].trim();
  
  const studentsRequiredMatch = content.match(/Number of students\s*(.+)/);
  if (studentsRequiredMatch) info.students_required = studentsRequiredMatch[1].trim();
  
  const allowanceMatch = content.match(/Monthly allowance\s*(.+)/);
  if (allowanceMatch) info.monthly_allowance = allowanceMatch[1].trim();
  
  const workingHoursMatch = content.match(/Working Days:\s*(.+)/);
  if (workingHoursMatch) info.working_hours = workingHoursMatch[1].trim();
  
  const descriptionMatch = content.match(/Company brief\s*description\s*(.+?)\s*Indicate if/s);
  if (descriptionMatch) info.company_description = descriptionMatch[1].trim();
  
  const jobDescriptions = content.match(/(\d+\.\s*.+?Intern.+?)(?=\d+\.\s*.+?Intern|\Z)/gs);
  if (jobDescriptions) info.job_descriptions = jobDescriptions.map(desc => desc.trim());
  
  return cleanAndNormalize(info);
}

function extractStudentInfo(content) {
  const info = {};
  
  const nameMatch = content.match(/Name:\s*(.+)/);
  if (nameMatch) info.name = nameMatch[1].trim();
  
  const emailMatch = content.match(/Email:\s*(.+)/);
  if (emailMatch) info.email = emailMatch[1].trim();
  
  const phoneMatch = content.match(/Phone:\s*(.+)/);
  if (phoneMatch) info.phone = phoneMatch[1].trim();
  
  const linkedinMatch = content.match(/LinkedIn:\s*(.+)/);
  if (linkedinMatch) info.linkedin = linkedinMatch[1].trim();
  
  const educationMatch = content.match(/Education:\s*([\s\S]+?)(?=Skills:|$)/);
  if (educationMatch) info.education = educationMatch[1].trim().split('\n').join(';');
  
  const skillsMatch = content.match(/Skills:\s*([\s\S]+?)(?=Work Experience:|$)/);
  if (skillsMatch) info.skills = skillsMatch[1].trim().split('\n').join('; ');
  
  const workExperienceMatch = content.match(/Work Experience:\s*([\s\S]+?)(?=Projects:|$)/);
  if (workExperienceMatch) info.work_experience = workExperienceMatch[1].trim().split('\n').join(';');
  
  const projectsMatch = content.match(/Projects:\s*([\s\S]+?)(?=Certifications:|$)/);
  if (projectsMatch) info.projects = projectsMatch[1].trim().split('\n').join(';');
  
  const certificationsMatch = content.match(/Certifications:\s*([\s\S]+)/);
  if (certificationsMatch) info.certifications = certificationsMatch[1].trim().split('\n').join(';');
  
  return cleanAndNormalize(info);
}

export function convertToCSV(data, type) {
  const headers = type === 'company' 
    ? ['company_name', 'website', 'students_required', 'monthly_allowance', 'working_hours', 'company_description', 'job_title_1', 'job_description_1', 'job_requirements_1', 'job_title_2', 'job_description_2', 'job_requirements_2']
    : ['name', 'email', 'phone', 'linkedin', 'education', 'skills', 'work_experience', 'projects', 'certifications'];

  let csvContent = headers.join(',') + '\n';

  data.forEach(item => {
    const row = headers.map(header => {
      let cell = item[header] || '';
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    csvContent += row.join(',') + '\n';
  });

  return csvContent;
}
