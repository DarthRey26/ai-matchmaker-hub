import OpenAI from 'openai';

const API_KEY = "sk-svcacct-kDvOwgXZJdqtNOXVHDZlx5QM-tGOz-RtMawF_rrQUbw8GpwcnHYZjqHSLXMRuxbCzQrPXguaY9kJwT3BlbkFJ5UH7j_TNelMAU1faa0l2wTSfJ4fRBfLNBO4JoZD9UtT8SX55LCHmhAdCRJod7O8wITm6GfwJC7_AA";

const openai = new OpenAI({
  apiKey: API_KEY,
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
  try {
    const results = [];
    
    for (const student of studentData) {
      const studentMatches = [];
      
      for (const company of companyData) {
        const studentText = `${student.name || ''} ${(student.skills || []).join(' ')} ${(student.experience || []).join(' ')}`;
        const companyText = `${company.company_name || ''} ${(company.requirements || []).join(' ')} ${(company.job_descriptions || []).map(job => job.description || '').join(' ')}`;
        
        const studentEmbedding = await generateEmbeddings(studentText);
        const companyEmbedding = await generateEmbeddings(companyText);
        
        const similarity = cosineSimilarity(studentEmbedding, companyEmbedding);
        const matchScore = similarity * 100;
        
        const explanation = await generateMatchExplanation(student, company, matchScore);
        
        studentMatches.push({
          company_name: company.company_name || 'Unknown Company',
          matchScore,
          explanation,
          requirements: company.requirements || [],
          jobDescriptions: company.job_descriptions || []
        });
      }
      
      const topMatches = studentMatches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      
      results.push({
        student: student.name || 'Unknown Student',
        matches: topMatches
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error generating matching results:', error);
    throw error;
  }
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}