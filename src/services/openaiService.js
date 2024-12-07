import OpenAI from 'openai';
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function extractStudentInfo(text) {
  console.log('Extracting student information...');
  if (!text || typeof text !== 'string') {
    console.error('Invalid text input:', text);
    return null;
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Extract structured information from this resume. Include name, skills, experience, education, and any other relevant details. Return as JSON."
      }, {
        role: "user",
        content: text
      }],
      temperature: 0.3,
    });

    const parsedInfo = JSON.parse(response.choices[0].message.content);
    console.log('Extracted student information:', parsedInfo);
    return parsedInfo;
  } catch (error) {
    console.error('Error extracting student information:', error);
    toast.error('Failed to extract student information');
    return null;
  }
}

export async function extractCompanyInfo(text) {
  console.log('Extracting company information...');
  if (!text || typeof text !== 'string') {
    console.error('Invalid text input:', text);
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Extract structured information from this job posting. Include company name, role, requirements, skills needed, and any other relevant details. Return as JSON."
      }, {
        role: "user",
        content: text
      }],
      temperature: 0.3,
    });

    const parsedInfo = JSON.parse(response.choices[0].message.content);
    console.log('Extracted company information:', parsedInfo);
    return parsedInfo;
  } catch (error) {
    console.error('Error extracting company information:', error);
    toast.error('Failed to extract company information');
    return null;
  }
}

export async function calculateMatchScore(studentInfo, companyInfo) {
  if (!studentInfo || !companyInfo) {
    console.error('Missing input for match calculation:', { studentInfo, companyInfo });
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Calculate match scores between student and job position. Consider skills, experience, and requirements. Return JSON with overall score (0-100), skills match, experience match, strengths, and areas for improvement."
      }, {
        role: "user",
        content: JSON.stringify({ student: studentInfo, company: companyInfo })
      }],
      temperature: 0.3,
    });

    const scores = JSON.parse(response.choices[0].message.content);
    console.log('Match scores calculated:', scores);
    return scores;
  } catch (error) {
    console.error('Error calculating match score:', error);
    toast.error('Failed to calculate match score');
    return null;
  }
}

export async function generateMatchExplanation(studentInfo, companyInfo) {
  if (!studentInfo || !companyInfo) {
    return "Unable to generate explanation due to missing information.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Provide a detailed explanation of the match between student and company position. Highlight strengths and potential areas for growth. Be specific and constructive."
      }, {
        role: "user",
        content: JSON.stringify({ student: studentInfo, company: companyInfo })
      }],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating match explanation:', error);
    return "Error generating match explanation.";
  }
}

export async function generateMatchingResults(studentData, companyData) {
  console.log('Starting matching process with:', {
    students: studentData.length,
    companies: companyData.length
  });

  const matches = [];

  for (const student of studentData) {
    console.log(`Processing student: ${student.name}`);
    const studentMatches = [];

    for (const company of companyData) {
      console.log(`Evaluating match with company: ${company.company_name}`);
      
      try {
        const matchScore = await calculateMatchScore(student, company);
        
        if (matchScore && matchScore.overall >= 40) {
          const explanation = await generateMatchExplanation(student, company);
          
          studentMatches.push({
            company_name: company.company_name || 'Company Name Not Available',
            role: company.role || 'Role Not Specified',
            matchScore: matchScore.overall,
            skillsMatch: matchScore.skills || 0,
            experienceMatch: matchScore.experience || 0,
            explanation: explanation,
            requirements: company.requirements || [],
            strengths: matchScore.strengths || [],
            improvements: matchScore.improvements || []
          });
        }
      } catch (error) {
        console.error('Error processing match:', error);
        continue;
      }
    }

    // Sort matches by score in descending order
    studentMatches.sort((a, b) => b.matchScore - a.matchScore);

    matches.push({
      student: student.name,
      matches: studentMatches.length > 0 ? studentMatches : [{
        company_name: "No Matches Found",
        matchScore: 0,
        explanation: "No suitable matches were found based on the current criteria."
      }]
    });
  }

  console.log('Completed matching process:', matches);
  return matches;
}