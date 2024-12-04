import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matchingRoutes from './routes/matchingRoutes.js';
import openaiRoutes from './routes/openaiRoutes.js';  // Add this import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: 'http://localhost:8081',
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
  destination: (req, file, cb) => {
    const type = req.body.type || req.query.type;

    if (!type || (type !== 'student' && type !== 'company')) {
      return cb(new Error('Invalid or missing document type'));
    }

    const uploadPath = path.join(__dirname, 'uploads', type === 'student' ? 'students' : 'companies');

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Add OpenAI routes
app.use('/api/openai', openaiRoutes);

// Add the new matching routes
app.use('/api/matching', matchingRoutes);

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

// Update the documents route to handle absolute paths
app.get('/documents', (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const studentDir = path.join(uploadsDir, 'students');
    const companyDir = path.join(uploadsDir, 'companies');

    // Ensure directories exist
    if (!fs.existsSync(studentDir)) {
      fs.mkdirSync(studentDir, { recursive: true });
    }
    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true });
    }

    // Read directories synchronously
    const students = fs.readdirSync(studentDir).filter(file => file.endsWith('.pdf'));
    const companies = fs.readdirSync(companyDir).filter(file => file.endsWith('.pdf'));
    
    const formatFileName = (fileName) => {
      return fileName
        .replace(/^\d+-/, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\s+/g, ' ')
        .replace(/\.pdf$/, '')
        .trim();
    };

    const response = {
      students: students.map(file => ({
        original: file,
        formatted: formatFileName(file)
      })),
      companies: companies.map(file => ({
        original: file,
        formatted: formatFileName(file)
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({ error: 'Failed to get documents' });
  }
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

function logExtraction(info) {
  console.log('Extracted Company Info:', info);
}
