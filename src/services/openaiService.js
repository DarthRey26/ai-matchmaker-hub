import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is missing. Please check your environment variables.');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export async function generateEmbeddings(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

export async function generateMatchExplanation(student, company, matchScore) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI career advisor explaining why a student matches with a company."
        },
        {
          role: "user",
          content: `Explain why ${student.name} matches with ${company.name} with a ${matchScore}% match score. Consider their skills and experience.`
        }
      ],
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating match explanation:', error);
    throw error;
  }
}

export async function generateMatchingResults(studentData, companyData) {
  const matches = [];
  
  for (const student of studentData) {
    const studentEmbedding = await generateEmbeddings(JSON.stringify(student));
    const companyMatches = await Promise.all(
      companyData.map(async (company) => {
        const companyEmbedding = await generateEmbeddings(JSON.stringify(company));
        const similarity = calculateCosineSimilarity(studentEmbedding, companyEmbedding);
        const explanation = await generateMatchExplanation(student, company, similarity * 100);
        
        return {
          company_name: company.name,
          similarity_score: similarity,
          explanation
        };
      })
    );
    
    matches.push({
      student_name: student.name,
      matches: companyMatches.sort((a, b) => b.similarity_score - a.similarity_score)
    });
  }
  
  return matches;
}

function calculateCosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}