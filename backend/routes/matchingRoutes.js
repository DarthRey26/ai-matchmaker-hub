import express from 'express';
import { extractStudentInfo, extractCompanyInfo, generateMatchExplanation, calculateMatchScore } from '../../src/services/openaiService.js';
import { processResumes, processCompanyPDFs } from '../../src/utils/advancedExtraction.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/enhanced-matching', async (req, res) => {
  try {
    console.log('Starting enhanced matching process...');
    
    // Get student and company documents
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    const studentDocs = await processResumes(studentDir);
    const companyDocs = await processCompanyPDFs(companyDir);

    console.log(`Processing ${studentDocs.length} students and ${companyDocs.length} companies`);

    const matches = [];

    // Process each student
    for (const student of studentDocs) {
      console.log(`Processing student: ${student.name}`);
      
      const studentInfo = await extractStudentInfo(student.text);
      if (!studentInfo) {
        console.error('Failed to extract student info for:', student.name);
        continue;
      }

      const studentMatches = [];

      // Find matches with companies
      for (const company of companyDocs) {
        console.log(`Evaluating match with company: ${company.company_name}`);
        
        const companyInfo = await extractCompanyInfo(company.text);
        if (!companyInfo) {
          console.error('Failed to extract company info for:', company.company_name);
          continue;
        }
        
        // Calculate match score
        const scores = await calculateMatchScore(studentInfo, companyInfo);
        
        if (scores && scores.overall >= 40) {
          const explanation = await generateMatchExplanation(studentInfo, companyInfo);
          
          studentMatches.push({
            company_name: company.company_name,
            role: companyInfo.role,
            matchScore: scores.overall,
            skillsMatch: scores.skills,
            experienceMatch: scores.experience,
            matchExplanation: explanation,
            requirements: companyInfo.requirements,
            studentStrengths: scores.strengths,
            improvementAreas: scores.improvements
          });
        }
      }

      // Sort matches by score
      studentMatches.sort((a, b) => b.matchScore - a.matchScore);

      matches.push({
        student: student.name,
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