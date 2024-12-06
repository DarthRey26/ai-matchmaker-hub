import express from 'express';
import { generateEmbeddings, generateMatchExplanation } from '../../src/services/openaiService.js';
import { processResumes, processCompanyPDFs } from '../../src/utils/advancedExtraction.js';
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
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    const studentData = await processResumes(studentDir);
    const companyData = await processCompanyPDFs(companyDir);

    const enhancedMatches = [];

    for (const student of studentData) {
      const studentText = `${student.name || ''} ${(student.skills || []).join(' ')} ${(student.experience || []).map(exp => (exp.job_titles || []).join(' ')).join(' ')}`;
      const studentEmbedding = await generateEmbeddings(studentText);

      const companyMatches = await Promise.all(companyData.map(async (company) => {
        const companyText = `${company.company_name || ''} ${(company.requirements || []).join(' ')} ${(company.job_descriptions || []).map(job => job.description || '').join(' ')}`;
        const companyEmbedding = await generateEmbeddings(companyText);

        const similarity = cosineSimilarity(studentEmbedding, companyEmbedding);
        const matchScore = similarity * 100;

        const explanation = await generateMatchExplanation(student, company, matchScore);

        return {
          company_name: company.company_name || 'Unknown Company',
          role: company.role || 'Position Available',
          matchScore,
          explanation,
          details: {
            requirements: company.requirements || [],
            jobDescriptions: company.job_descriptions || []
          }
        };
      }));

      enhancedMatches.push({
        student: student.name || 'Unknown Student',
        matches: companyMatches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
      });
    }

    res.json({ matches: enhancedMatches });
  } catch (error) {
    console.error('Error in enhanced matching:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;