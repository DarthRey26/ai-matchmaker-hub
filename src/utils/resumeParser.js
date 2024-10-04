import { parseResumeFromPdf } from './resumeParser';

export async function extractInformation(fileUrl) {
  try {
    const resume = await parseResumeFromPdf(fileUrl);
    return {
      isStudent: true,
      name: resume.profile.name,
      email: resume.profile.email,
      phone: resume.profile.phone,
      location: resume.profile.location,
      summary: resume.profile.summary,
      education: resume.educations,
      experience: resume.workExperiences,
      skills: resume.skills.descriptions,
      projects: resume.projects
    };
  } catch (error) {
    console.error('Error extracting information from PDF:', error);
    return null;
  }
}

// Keep the existing extractCompanyInformation function
function extractCompanyInformation(text) {
  // ... (keep the existing implementation)
}