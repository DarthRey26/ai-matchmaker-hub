import OpenAI from 'openai';
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function extractCompanyInfo(text) {
  console.log('Extracting company information from:', text.substring(0, 100) + '...');
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Extract structured information from this job posting. Include company name, role, requirements, skills needed, and any other relevant details."
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

export async function extractStudentInfo(text) {
  console.log('Extracting student information from:', text.substring(0, 100) + '...');
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Extract structured information from this resume. Include name, skills, experience, education, and any other relevant details."
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

export async function generateMatchExplanation(studentInfo, companyInfo) {
  console.log('Generating match explanation for:', {
    student: studentInfo.name,
    company: companyInfo.company_name
  });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Analyze the match between a student and company position. Provide detailed explanation of match strength, highlighting alignments and gaps."
      }, {
        role: "user",
        content: JSON.stringify({ student: studentInfo, company: companyInfo })
      }],
      temperature: 0.3,
    });

    const explanation = response.choices[0].message.content;
    console.log('Generated match explanation:', explanation);
    return explanation;
  } catch (error) {
    console.error('Error generating match explanation:', error);
    toast.error('Failed to generate match explanation');
    return null;
  }
}

export async function calculateMatchScore(studentInfo, companyInfo) {
  console.log('Calculating match score between:', {
    student: studentInfo.name,
    company: companyInfo.company_name
  });
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Calculate a match score (0-100) between student and company position. Consider skills, experience, education, and requirements. Return JSON with overall score and component scores."
      }, {
        role: "user",
        content: JSON.stringify({ student: studentInfo, company: companyInfo })
      }],
      temperature: 0.3,
    });

    const scores = JSON.parse(response.choices[0].message.content);
    console.log('Calculated match scores:', scores);
    return scores;
  } catch (error) {
    console.error('Error calculating match score:', error);
    toast.error('Failed to calculate match score');
    return null;
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
            company_name: company.company_name,
            role: company.role || 'Role not specified',
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