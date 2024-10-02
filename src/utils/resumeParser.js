export function extractInformation(text) {
  const isStudent = text.toLowerCase().includes('student') || text.toLowerCase().includes('education');
  
  if (isStudent) {
    return extractStudentInformation(text);
  } else {
    return extractCompanyInformation(text);
  }
}

function extractStudentInformation(text) {
  const name = extractName(text);
  const school = extractSchool(text);
  const faculty = extractFaculty(text);
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);

  return {
    isStudent: true,
    name,
    school,
    faculty,
    skills,
    experience,
    education
  };
}

function extractCompanyInformation(text) {
  const name = extractCompanyName(text);
  const industry = extractIndustry(text);
  const description = extractDescription(text);
  const jobDescription = extractJobDescription(text);

  return {
    isStudent: false,
    name,
    industry,
    description,
    jobDescription
  };
}

function extractName(text) {
  const nameRegex = /name:?\s*([^\n]+)/i;
  const match = text.match(nameRegex);
  return match ? match[1].trim() : 'Unknown';
}

function extractSchool(text) {
  const schoolRegex = /school:?\s*([^\n]+)/i;
  const match = text.match(schoolRegex);
  return match ? match[1].trim() : 'Unknown';
}

function extractFaculty(text) {
  const facultyRegex = /faculty:?\s*([^\n]+)/i;
  const match = text.match(facultyRegex);
  return match ? match[1].trim() : 'Unknown';
}

function extractSkills(text) {
  const skillsRegex = /skills:?\s*([^\n]+)/i;
  const match = text.match(skillsRegex);
  return match ? match[1].split(',').map(skill => skill.trim()) : [];
}

function extractExperience(text) {
  const experienceRegex = /experience:?\s*([\s\S]*?)(?=\n\s*\n|\s*$)/i;
  const match = text.match(experienceRegex);
  return match ? match[1].trim().split('\n').map(exp => exp.trim()) : [];
}

function extractEducation(text) {
  const educationRegex = /education:?\s*([\s\S]*?)(?=\n\s*\n|\s*$)/i;
  const match = text.match(educationRegex);
  return match ? match[1].trim().split('\n').map(edu => edu.trim()) : [];
}

function extractCompanyName(text) {
  const nameRegex = /company\s*name:?\s*([^\n]+)/i;
  const match = text.match(nameRegex);
  return match ? match[1].trim() : 'Unknown';
}

function extractIndustry(text) {
  const industryRegex = /industry:?\s*([^\n]+)/i;
  const match = text.match(industryRegex);
  return match ? match[1].trim() : 'Unknown';
}

function extractDescription(text) {
  const descriptionRegex = /description:?\s*([\s\S]*?)(?=\n\s*\n|\s*$)/i;
  const match = text.match(descriptionRegex);
  return match ? match[1].trim() : 'No description available.';
}

function extractJobDescription(text) {
  const jobDescriptionRegex = /job\s*description:?\s*([\s\S]*?)(?=\n\s*\n|\s*$)/i;
  const match = text.match(jobDescriptionRegex);
  return match ? match[1].trim() : 'No job description available.';
}