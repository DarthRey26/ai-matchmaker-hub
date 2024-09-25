const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'students';
    const uploadPath = path.join(__dirname, 'uploads', folder);
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

app.get('/documents', (req, res) => {
  const studentDocs = fs.existsSync(path.join(__dirname, 'uploads', 'students')) 
    ? fs.readdirSync(path.join(__dirname, 'uploads', 'students'))
    : [];
  const companyDocs = fs.existsSync(path.join(__dirname, 'uploads', 'companies'))
    ? fs.readdirSync(path.join(__dirname, 'uploads', 'companies'))
    : [];
  
  res.json({
    studentDocuments: studentDocs,
    companyDocuments: companyDocs
  });
});

app.get('/view/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', folder, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.delete('/delete/:folder/:filename', (req, res) => {
  const { folder, filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', folder, filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
