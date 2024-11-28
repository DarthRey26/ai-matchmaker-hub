import express from 'express';
import { processResumes, processCompanyPDFs } from '../../src/utils/advancedExtraction.js';
import { generateMatchingResults } from '../../src/services/openaiService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/matching-data', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    console.log('Processing resumes for OpenAI matching...');
    const studentData = await processResumes(studentDir);
    console.log('Processing company data for OpenAI matching...');
    const companyData = await processCompanyPDFs(companyDir);

    console.log('Generating OpenAI matches...');
    const matchingResults = await generateMatchingResults(studentData, companyData);

    res.json(matchingResults);
  } catch (error) {
    console.error('Error in OpenAI matching route:', error);
    res.status(500).json({ error: error.message || 'Failed to process and match data using OpenAI' });
  }
});

export default router;