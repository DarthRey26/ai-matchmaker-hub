const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { addDocument, removeDocument, getAllDocuments } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const type = req.body.type || req.query.type;
    if (!type || (type !== 'student' && type !== 'company')) {
      return cb(new Error('Invalid or missing document type'));
    }
    const uploadPath = path.join(__dirname, 'uploads', type === 'student' ? 'students' : 'companies');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const { type } = req.body;
  addDocument(type, req.file.filename);
  res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/student', express.static(path.join(__dirname, 'uploads', 'students')));
app.use('/uploads/company', express.static(path.join(__dirname, 'uploads', 'companies')));