import OpenAI from 'openai';

const API_KEY = "sk-svcacct-kDvOwgXZJdqtNOXVHDZlx5QM-tGOz-RtMawF_rrQUbw8GpwcnHYZjqHSLXMRuxbCzQrPXguaY9kJwT3BlbkFJ5UH7j_TNelMAU1faa0l2wTSfJ4fRBfLNBO4JoZD9UtT8SX55LCHmhAdCRJod7O8wITm6GfwJC7_AA";

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
});

export async function extractDocumentInfo(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract key information from this document. Include skills, experience, requirements, and role details."
        },
        {
          role: "user",
          content: text
        }
      ]
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error extracting document info:', error);
    throw error;
  }
}

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
  if (matchScore < 40) {
    return "No significant match found. The student's profile does not align well with this role's requirements.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI career advisor explaining why a student matches or doesn't match with a company."
        },
        {
          role: "user",
          content: `Analyze the match between ${student.name} and ${company.company_name} with a ${matchScore}% match score. Consider their skills and experience. If the match score is low, explain why they might not be a good fit.`
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