import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-svcacct-kDvOwgXZJdqtNOXVHDZlx5QM-tGOz-RtMawF_rrQUbw8GpwcnHYZjqHSLXMRuxbCzQrPXguaY9kJwT3BlbkFJ5UH7j_TNelMAU1faa0l2wTSfJ4fRBfLNBO4JoZD9UtT8SX55LCHmhAdCRJod7O8wITm6GfwJC7_AA',
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