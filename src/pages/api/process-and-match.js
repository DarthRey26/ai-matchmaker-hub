import { processResumes, processCompanyPDFs } from '../../utils/advancedExtraction';
import { matchStudentsToCompanies } from '../../utils/matchingAlgorithm';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    if (!fs.existsSync(studentDir) || !fs.existsSync(companyDir)) {
      return res.status(404).json({ error: 'Upload directories not found' });
    }

    const studentData = processResumes(studentDir);
    const companyData = processCompanyPDFs(companyDir);

    if (studentData.length === 0 || companyData.length === 0) {
      return res.status(404).json({ error: 'No PDF files found in upload directories' });
    }

    const matchingResults = matchStudentsToCompanies(studentData, companyData);
    
    const formattedResults = matchingResults.flatMap(result => 
      result.matches.map(match => ({
        "Student Name": result.name,
        "Company Name": match.company,
        "Match Probability": `${(match.probability * 100).toFixed(2)}%`
      }))
    );

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error processing and matching:', error);
    res.status(500).json({ error: error.message || 'Failed to process and match data' });
  }
}
