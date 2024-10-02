import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';

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

  const handlePDFsProcessed = (parsedResumes, parsedCompanyDocs) => {
    const newStudents = parsedResumes.map((resume, index) => ({
      id: index + 1,
      name: resume.info.name,
      school: resume.info.school,
      faculty: resume.info.faculty,
      company1: '',
      outcome1: 'Pending',
      company2: '',
      outcome2: 'Pending',
      backupCompany: '',
      match1: 0,
      match2: 0 
    }));

    const newCompanies = parsedCompanyDocs.map(doc => ({
      name: doc.info.name,
      summary: doc.info.description,
      slots: 2,
      industry: doc.info.industry,
      jobDescription: doc.info.jobDescription
    }));

    setStudents(newStudents);
    setCompanies(newCompanies);
    localStorage.setItem('students', JSON.stringify(newStudents));
    localStorage.setItem('companies', JSON.stringify(newCompanies));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <Dashboard students={students} companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default Index;