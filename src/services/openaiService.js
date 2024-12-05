import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY || "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",
  dangerouslyAllowBrowser: true
});

export async function generateEmbeddings(text) {
  try {
    console.log('Generating embeddings for text:', text.substring(0, 100) + '...');
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
    console.log('Generating match explanation for:', { student: student.name, company: company.company_name });
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI career advisor explaining why a student matches with a company."
        },
        {
          role: "user",
          content: `Explain why ${student.name} matches with ${company.company_name} with a ${matchScore}% match score. Consider their skills and experience.`
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
  console.log('Starting matching process...');
  const matches = [];
  
  for (const student of studentData) {
    console.log('Processing student:', student.name);
    const studentEmbedding = await generateEmbeddings(JSON.stringify(student));
    
    const companyMatches = await Promise.all(
      companyData.map(async (company) => {
        console.log('Matching with company:', company.company_name);
        const companyEmbedding = await generateEmbeddings(JSON.stringify(company));
        const similarity = calculateCosineSimilarity(studentEmbedding, companyEmbedding);
        const explanation = await generateMatchExplanation(student, company, similarity * 100);
        
        return {
          company_name: company.company_name,
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