import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-svcacct-kDvOwgXZJdqtNOXVHDZlx5QM-tGOz-RtMawF_rrQUbw8GpwcnHYZjqHSLXMRuxbCzQrPXguaY9kJwT3BlbkFJ5UH7j_TNelMAU1faa0l2wTSfJ4fRBfLNBO4JoZD9UtT8SX55LCHmhAdCRJod7O8wITm6GfwJC7_AA',
  dangerouslyAllowBrowser: true
});

// Helper functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function splitIntoChunks(text, maxLength = 2000) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxLength));
    i += maxLength;
  }
  return chunks;
}

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function extractStudentInfo(text) {
  console.log('Extracting student information...');
  if (!text || typeof text !== 'string') {
    console.error('Invalid text input:', text);
    return null;
  }
  
  try {
    const chunks = splitIntoChunks(text);
    let combinedInfo = {};
    
    for (const chunk of chunks) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Extract key information from this resume chunk. Include skills, experience, education, and other relevant details. Return as JSON."
        }, {
          role: "user",
          content: chunk
        }],
        temperature: 0.3,
        max_tokens: 500
      });
      
      const chunkInfo = JSON.parse(response.choices[0].message.content);
      combinedInfo = { ...combinedInfo, ...chunkInfo };
      await delay(500); // Throttle requests
    }
    
    console.log('Extracted student information:', combinedInfo);
    return combinedInfo;
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
    const chunks = splitIntoChunks(text);
    let combinedInfo = {};
    
    for (const chunk of chunks) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Extract key information from this job posting chunk. Include company name, role, requirements, and skills needed. Return as JSON."
        }, {
          role: "user",
          content: chunk
        }],
        temperature: 0.3,
        max_tokens: 500
      });
      
      const chunkInfo = JSON.parse(response.choices[0].message.content);
      combinedInfo = { ...combinedInfo, ...chunkInfo };
      await delay(500);
    }
    
    console.log('Extracted company information:', combinedInfo);
    return combinedInfo;
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
    // Generate embeddings for skills comparison
    const studentSkillsText = JSON.stringify(studentInfo.skills || []);
    const companySkillsText = JSON.stringify(companyInfo.requirements || []);
    
    const [studentEmbedding, companyEmbedding] = await Promise.all([
      generateEmbedding(studentSkillsText),
      generateEmbedding(companySkillsText)
    ]);
    
    const similarityScore = studentEmbedding && companyEmbedding ? 
      cosineSimilarity(studentEmbedding, companyEmbedding) : 0;
    
    // Get detailed analysis from GPT
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Analyze the match and provide scores. Consider the similarity score provided. Return JSON with overall score (0-100), skills match, experience match, strengths, and areas for improvement."
      }, {
        role: "user",
        content: JSON.stringify({
          student: studentInfo,
          company: companyInfo,
          similarityScore: similarityScore * 100
        })
      }],
      temperature: 0.3,
      max_tokens: 500
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
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Provide a concise explanation of the match. Focus on key strengths and areas for growth."
      }, {
        role: "user",
        content: JSON.stringify({
          student: {
            skills: studentInfo.skills,
            experience: studentInfo.experience
          },
          company: {
            requirements: companyInfo.requirements,
            role: companyInfo.role
          }
        })
      }],
      temperature: 0.3,
      max_tokens: 300
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating match explanation:', error);
    return "Error generating match explanation.";
  }
}

export async function generateMatchingResults(studentData, companyData) {
  const matches = [];
  
  for (const student of studentData) {
    const studentMatches = [];
    
    for (const company of companyData) {
      const matchScore = await calculateMatchScore(student, company);
      if (matchScore && matchScore.overall >= 40) {
        const explanation = await generateMatchExplanation(student, company);
        await delay(500); // Throttle requests
        
        studentMatches.push({
          companyName: company.company_name || 'Unknown Company',
          matchScore: matchScore.overall,
          skillsMatch: matchScore.skills || 0,
          experienceMatch: matchScore.experience || 0,
          matchExplanation: explanation,
          requirements: company.requirements || [],
          studentStrengths: matchScore.strengths || [],
          improvementAreas: matchScore.improvements || []
        });
      }
    }
    
    if (studentMatches.length > 0) {
      matches.push({
        studentName: student.name || 'Unknown Student',
        matches: studentMatches.sort((a, b) => b.matchScore - a.matchScore)
      });
    }
  }
  
  return { matches };
}