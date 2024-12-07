import express from 'express';
import { extractStudentInfo, extractCompanyInfo, calculateMatchScore, generateMatchExplanation } from '../../src/services/openaiService.js';
import { processResumes, processCompanyPDFs } from '../../src/utils/advancedExtraction.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/enhanced-matching', async (req, res) => {
  try {
    console.log('Starting enhanced matching process...');
    
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    // Read PDF files directly
    const studentFiles = fs.readdirSync(studentDir).filter(f => f.endsWith('.pdf'));
    const companyFiles = fs.readdirSync(companyDir).filter(f => f.endsWith('.pdf'));

    console.log(`Processing ${studentFiles.length} students and ${companyFiles.length} companies`);

    const matches = [];

    // Process each student
    for (const studentFile of studentFiles) {
      console.log(`Processing student: ${studentFile}`);
      const studentPath = path.join(studentDir, studentFile);
      const studentText = await fs.promises.readFile(studentPath, 'utf8');
      
      const studentInfo = await extractStudentInfo(studentText);
      if (!studentInfo) {
        console.error('Failed to extract student info for:', studentFile);
        continue;
      }

      const studentMatches = [];

      // Find matches with companies
      for (const companyFile of companyFiles) {
        const companyPath = path.join(companyDir, companyFile);
        const companyText = await fs.promises.readFile(companyPath, 'utf8');
        
        const companyInfo = await extractCompanyInfo(companyText);
        if (!companyInfo) {
          console.error('Failed to extract company info for:', companyFile);
          continue;
        }

        const matchScore = await calculateMatchScore(studentInfo, companyInfo);
        if (matchScore && matchScore.overall >= 40) {
          const explanation = await generateMatchExplanation(studentInfo, companyInfo);
          
          studentMatches.push({
            company_name: companyInfo.company_name || path.basename(companyFile, '.pdf'),
            role: companyInfo.role || 'Position Not Specified',
            matchScore: matchScore.overall,
            skillsMatch: matchScore.skills || 0,
            experienceMatch: matchScore.experience || 0,
            matchExplanation: explanation,
            requirements: companyInfo.requirements || [],
            studentStrengths: matchScore.strengths || [],
            improvementAreas: matchScore.improvements || []
          });
        }
      }

      // Sort matches by score
      studentMatches.sort((a, b) => b.matchScore - a.matchScore);

      matches.push({
        student: path.basename(studentFile, '.pdf'),
        matches: studentMatches.length > 0 ? studentMatches : [{
          company_name: "No Matches Found",
          matchScore: 0,
          matchExplanation: "No suitable matches were found based on the current criteria."
        }]
      });
    }

    console.log('Enhanced matching process completed');
    res.json({ matches });
  } catch (error) {
    console.error('Error in enhanced matching:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;