const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'documents.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { students: [], companies: [] };
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!data.students) data.students = [];
  if (!data.companies) data.companies = [];
  return data;
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function addDocument(type, filename) {
  const db = readDB();
  if (type === 'student' || type === 'company') {
    const key = type === 'student' ? 'students' : 'companies';
    if (!db[key]) db[key] = [];
    db[key].push(filename);
    writeDB(db);
    console.log(`Added document to ${key}:`, filename);
  } else {
    throw new Error(`Invalid document type: ${type}`);
  }
}

function removeDocument(type, filename) {
  const db = readDB();
  if (type === 'student' || type === 'company') {
    const key = type === 'student' ? 'students' : 'companies';
    db[key] = db[key].filter(doc => doc !== filename);
    writeDB(db);
  } else {
    throw new Error(`Invalid document type: ${type}`);
  }
}

function getAllDocuments() {
  const data = readDB();
  console.log('All documents:', JSON.stringify(data, null, 2));
  return data;
}

module.exports = {
  addDocument,
  removeDocument,
  getAllDocuments
};

