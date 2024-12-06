import express from 'express';
import { generateEmbeddings, generateMatchExplanation, extractDocumentInfo } from '../../src/services/openaiService.js';
import { processResumes, processCompanyPDFs } from '../../src/utils/advancedExtraction.js';
import { matchStudentsToCompanies } from '../../src/utils/matchingAlgorithm.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (normA * normB);
}

router.get('/enhanced-matching', async (req, res) => {
  try {
    const { matchingType } = req.query;
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    if (matchingType === 'iris-stacked') {
      // OpenAI-powered matching
      console.log('Processing resumes and company data with OpenAI...');
      const studentData = await processResumes(studentDir);
      const companyData = await processCompanyPDFs(companyDir);

      const enhancedMatches = [];

      for (const student of studentData) {
        const studentName = student.name?.replace(/^\d+-/, '').replace(/_/g, ' ').replace(/\.pdf$/, '') || 'Unknown Student';
        const studentText = `${studentName} ${(student.skills || []).join(' ')} ${(student.experience || []).map(exp => (exp.job_titles || []).join(' ')).join(' ')}`;
        
        const studentEmbedding = await generateEmbeddings(studentText);
        const companyMatches = await Promise.all(companyData.map(async (company) => {
          const companyName = company.company_name?.replace(/^\d+-/, '').replace(/_/g, ' ').replace(/\.pdf$/, '') || 'Unknown Company';
          const companyText = `${companyName} ${(company.requirements || []).join(' ')} ${(company.job_descriptions || []).map(job => job.description || '').join(' ')}`;
          const companyEmbedding = await generateEmbeddings(companyText);

          const similarity = cosineSimilarity(studentEmbedding, companyEmbedding);
          const matchScore = similarity * 100;

          // Only include matches with a score above 40%
          if (matchScore < 40) {
            return null;
          }

          const explanation = await generateMatchExplanation(
            { name: studentName, ...student },
            { company_name: companyName, ...company },
            matchScore
          );

          return {
            company_name: companyName,
            role: company.role || 'Position Available',
            matchScore,
            explanation,
            details: {
              requirements: company.requirements || [],
              jobDescriptions: company.job_descriptions || []
            }
          };
        }));

        const validMatches = companyMatches.filter(match => match !== null);
        
        enhancedMatches.push({
          student: studentName,
          matches: validMatches.length > 0 
            ? validMatches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
            : [{ 
                company_name: "No Matches Found",
                matchScore: 0,
                explanation: "No suitable matches were found based on the student's profile and available positions.",
                details: {
                  requirements: [],
                  jobDescriptions: []
                }
              }]
        });
      }

      res.json({ matches: enhancedMatches });
    } else {
      // Use traditional bidirectional matching
      const studentData = await processResumes(studentDir);
      const companyData = await processCompanyPDFs(companyDir);
      const matches = matchStudentsToCompanies(studentData, companyData);
      res.json({ matches });
    }
  } catch (error) {
    console.error('Error in matching:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;