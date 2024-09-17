import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import FileUploadDownload from '../components/FileUploadDownload';

const Index = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedCompanies = localStorage.getItem('companies');
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">IRIS - AI-Powered Student-Company Matching</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Dashboard students={students} companies={companies} />
          <div className="mt-8">
            <Link to="/matching" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to Student-Company Matching
            </Link>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">File Upload and Download</h2>
            <FileUploadDownload />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
