import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export function addDocument(type, filename) {
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

export function removeDocument(type, filename) {
  const db = readDB();
  if (type === 'student' || type === 'company') {
    const key = type === 'student' ? 'students' : 'companies';
    db[key] = db[key].filter(doc => doc !== filename);
    writeDB(db);
  } else {
    throw new Error(`Invalid document type: ${type}`);
  }
}

export function getAllDocuments() {
  const data = readDB();
  console.log('All documents:', JSON.stringify(data, null, 2));
  return data;
}
