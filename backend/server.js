import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { Worker } from 'worker_threads';
import { addDocument, removeDocument, getAllDocuments } from './db.js';
import { fileURLToPath } from 'url';
import { processResumes, processCompanyPDFs } from '../src/utils/advancedExtraction.js';
import { matchStudentsToCompanies, enhancedMatchingAlgorithm } from '../src/utils/matchingAlgorithm.js';
import { BidirectionalMatcher } from '../src/utils/bidirectionalMatching.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: 'http://localhost:8081', // Update this to match your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    console.log('Multer destination function called');
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);
    console.log('File:', file);

    const type = req.body.type || req.query.type;
    console.log('Document type:', type);

    if (!type || (type !== 'student' && type !== 'company')) {
      console.error('Invalid document type:', type);
      return cb(new Error('Invalid or missing document type'));
    }

    const uploadPath = path.join(__dirname, 'uploads', type === 'student' ? 'students' : 'companies');
    console.log('Upload path:', uploadPath);

    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error creating directory:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Queue for processing files
const processQueue = [];
let isProcessing = false;

app.post('/api/upload-documents', (req, res, next) => {
  console.log('Received upload request');
  console.log('Request body before multer:', req.body);
  console.log('Request query:', req.query);
  
  upload.array('documents')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    const type = req.body.type || req.query.type;
    if (!type || (type !== 'student' && type !== 'company')) {
      return res.status(400).json({ error: 'Invalid or missing document type' });
    }
    
    req.documentType = type; // Store the type for later use
    next();
  });
}, async (req, res) => {
  try {
    console.log('Processing upload request');
    console.log('Request body after multer:', req.body);
    const files = req.files;
    const type = req.documentType; // Use the stored type

    console.log(`Files: ${JSON.stringify(files)}`);
    console.log(`Type: ${type}`);

    if (!files || files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ error: 'No files uploaded' });
    }

    for (const file of files) {
      try {
        console.log(`Processing file: ${file.filename}`);
        await addDocument(type, file.filename);
        console.log(`Successfully added document: ${file.filename}`);
      } catch (error) {
        console.error(`Error adding document ${file.filename}:`, error);
        return res.status(500).json({ error: `Error adding document ${file.filename}: ${error.message}` });
      }
    }

    console.log('All files processed successfully');
    res.json({ message: 'Files uploaded successfully', processedFiles: files.length });
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ error: `Error uploading files: ${error.message}` });
  }
});

app.get('/documents', (req, res) => {
  const documents = getAllDocuments();
  res.json(documents);
});

app.delete('/delete/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  removeDocument(folder, filename);
  res.json({ message: 'File deleted successfully' });
});

app.get('/extracted-texts', async (req, res) => {
  try {
    const extractedTexts = {
      students: {},
      companies: {}
    };

    // Read the contents of the 'uploads/students' and 'uploads/companies' directories
    const studentFiles = await fs.readdir(path.join(__dirname, 'uploads', 'students'));
    const companyFiles = await fs.readdir(path.join(__dirname, 'uploads', 'companies'));

    // Read the content of each file
    for (const file of studentFiles) {
      const filePath = path.join(__dirname, 'uploads', 'students', file);
      extractedTexts.students[file] = await fs.readFile(filePath, 'utf8');
    }

    for (const file of companyFiles) {
      const filePath = path.join(__dirname, 'uploads', 'companies', file);
      extractedTexts.companies[file] = await fs.readFile(filePath, 'utf8');
    }

    res.json(extractedTexts);
  } catch (error) {
    console.error('Error in /extracted-texts route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/matching-data', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    console.log('Processing resumes...');
    const studentData = await processResumes(studentDir);
    console.log('Student data:', JSON.stringify(studentData, null, 2));

    console.log('Processing company data...');
    const companyData = await processCompanyPDFs(companyDir);
    console.log('Company data:', JSON.stringify(companyData, null, 2));

    console.log('Matching students to companies...');
    const bidirectionalMatcher = new BidirectionalMatcher(studentData, companyData);
    const matchingResults = bidirectionalMatcher.generateMatchingMetrics();
    
    const formattedResults = {
      matches: matchingResults.map(result => ({
        studentName: result.student,
        matches: result.matches.slice(0, 2).map(match => ({
          companyName: match.company,
          probability: Number((match.bidirectionalScore * 100).toFixed(2)),
          status: 'Not Yet',
          qualityMetrics: {
            skillFit: Number((match.details.student.skillMatch).toFixed(2)),
            experienceFit: Number((match.details.student.experienceMatch).toFixed(2)),
            overallQuality: Number((match.bidirectionalScore * 100).toFixed(2))
          }
        }))
      })).filter(result => result.matches.length > 0)
    };

    res.json(formattedResults);
  } catch (error) {
    console.error('Error processing and matching:', error);
    res.status(500).json({ error: error.message || 'Failed to process and match data' });
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.get('/api/company-data', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const companyDir = path.join(uploadsDir, 'companies');

    console.log('Processing company data...');
    const companyData = await processCompanyPDFs(companyDir);
    console.log('Company data:', JSON.stringify(companyData, null, 2));

    res.json(companyData);
  } catch (error) {
    console.error('Error processing company data:', error);
    res.status(500).json({ error: error.message || 'Failed to process company data' });
  }
});

function processNextFile() {
  if (processQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const { path: filePath, type } = processQueue.shift();

  const worker = new Worker('./fileProcessingWorker.js', { workerData: { filePath, type } });

  worker.on('message', (result) => {
    console.log(`Processed file: ${filePath}`);
    console.log('Result:', result);
    // Here you would typically save the result to a database
    processNextFile();
  });

  worker.on('error', (error) => {
    console.error(`Error processing file ${filePath}:`, error);
    processNextFile();
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/student', express.static(path.join(__dirname, 'uploads', 'students')));
app.use('/uploads/company', express.static(path.join(__dirname, 'uploads', 'companies')));
