import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

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