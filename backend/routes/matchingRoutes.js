import express from 'express';
import { extractCompanyInfo, extractStudentInfo, generateMatchExplanation, calculateMatchScore } from '../../src/services/openaiService.js';
import { processResumes, processCompanyPDFs } from '../../src/utils/advancedExtraction.js';

const router = express.Router();

router.get('/enhanced-matching', async (req, res) => {
  try {
    console.log('Starting enhanced matching process...');

    // Get student and company documents
    const studentDocs = await processResumes('./uploads/students');
    const companyDocs = await processCompanyPDFs('./uploads/companies');

    console.log(`Processing ${studentDocs.length} students and ${companyDocs.length} companies`);

    const matches = [];

    // Process each student
    for (const student of studentDocs) {
      console.log(`Processing student: ${student.name}`);
      
      const studentInfo = await extractStudentInfo(student.text);
      const studentMatches = [];

      // Find matches with companies
      for (const company of companyDocs) {
        console.log(`Evaluating match with company: ${company.company_name}`);
        
        const companyInfo = await extractCompanyInfo(company.text);
        
        // Calculate match score
        const scores = await calculateMatchScore(studentInfo, companyInfo);
        
        if (scores && scores.overall >= 40) { // Only include matches above 40%
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
        matches: studentMatches.slice(0, 3) // Top 3 matches only
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