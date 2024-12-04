import OpenAI from 'openai';
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false // Ensure API key is never exposed to the client
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
    toast.error('Failed to generate embeddings');
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
    toast.error('Failed to generate match explanation');
    throw error;
  }
}