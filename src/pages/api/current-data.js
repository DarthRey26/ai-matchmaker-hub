import { processResumes, processCompanyPDFs } from '../../utils/advancedExtraction';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    const studentData = await processResumes(studentDir);
    const companyData = await processCompanyPDFs(companyDir);

    res.status(200).json({
      students: studentData,
      companies: companyData
    });
  } catch (error) {
    console.error('Error fetching current data:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch current data' });
  }
}
