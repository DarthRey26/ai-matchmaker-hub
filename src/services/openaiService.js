import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'your_actual_api_key_here',
  dangerouslyAllowBrowser: true
});

export const generateMatchingResults = async (students, companies) => {
  try {
    const prompt = `
      Given these students with their skills and experiences:
      ${JSON.stringify(students, null, 2)}
      
      And these companies with their requirements:
      ${JSON.stringify(companies, null, 2)}
      
      Generate optimal matches between students and companies based on:
      1. Skills match
      2. Experience relevance
      3. Company requirements fit
      
      For each student, provide:
      - Top 2 company matches
      - Match probability percentage
      - Detailed quality metrics (skillFit, experienceFit, overallQuality)
      
      Format the response exactly like this example:
      {
        "matches": [
          {
            "studentName": "John Doe",
            "matches": [
              {
                "companyName": "Company A",
                "probability": 85.5,
                "status": "Not Yet",
                "qualityMetrics": {
                  "skillFit": 90,
                  "experienceFit": 85,
                  "overallQuality": 87.5
                }
              }
            ]
          }
        ]
      }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional AI recruiter that specializes in matching students to companies based on their skills, experience, and company requirements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('Error in OpenAI matching:', error);
    throw error;
  }
};