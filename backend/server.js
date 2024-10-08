const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { Worker } = require('worker_threads');
const { addDocument, removeDocument, getAllDocuments } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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