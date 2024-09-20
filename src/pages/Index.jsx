import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';

const Index = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedCompanies = localStorage.getItem('companies');
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      setStudents([
        { id: 1, name: 'Adarius', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Pending', company2: 'Watson Farley & Williams', outcome2: 'Pending', backupCompany: '', match1: 85, match2: 92 },
        { id: 2, name: 'Nicole', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Pending', company2: 'Watson Farley & Williams', outcome2: 'Pending', backupCompany: '', match1: 88, match2: 90 },
        { id: 3, name: 'Aidan', school: 'Temasek Poly', faculty: 'Law', company1: 'Watson Farley & Williams', outcome1: 'Pending', company2: 'KC Partnership', outcome2: 'Pending', backupCompany: '', match1: 91, match2: 87 },
        { id: 4, name: 'Sophia', school: 'Singapore Poly', faculty: 'Business', company1: 'Mazars', outcome1: 'Pending', company2: 'FinEdge Consulting', outcome2: 'Pending', backupCompany: '', match1: 89, match2: 93 },
        { id: 5, name: 'Ethan', school: 'Ngee Ann Poly', faculty: 'Engineering', company1: 'TechNova Solutions', outcome1: 'Pending', company2: 'Forvia', outcome2: 'Pending', backupCompany: '', match1: 94, match2: 86 },
      ]);
    }
    
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    } else {
      setCompanies([
        { name: 'KC Partnership', summary: 'A leading law firm specializing in corporate law and mergers & acquisitions.', slots: 2, industry: 'Legal Services' },
        { name: 'Watson Farley & Williams', summary: 'An international law firm focusing on energy, maritime, and infrastructure sectors.', slots: 2, industry: 'Legal Services' },
        { name: 'Mazars', summary: 'A global audit, tax, and advisory firm helping organizations navigate business complexities.', slots: 2, industry: 'Financial Services' },
        { name: 'Forvia', summary: 'An automotive technology company developing innovative solutions for future mobility.', slots: 2, industry: 'Automotive' },
        { name: 'The Chosen One Agency', summary: 'A creative marketing agency known for its cutting-edge digital campaigns.', slots: 2, industry: 'Marketing' },
        { name: 'TechNova Solutions', summary: 'A software development company specializing in AI and machine learning applications.', slots: 2, industry: 'Technology' },
        { name: 'GreenEarth Renewables', summary: 'A renewable energy company focused on developing sustainable power solutions.', slots: 2, industry: 'Energy' },
        { name: 'FinEdge Consulting', summary: 'A financial consulting firm offering services in investment banking and wealth management.', slots: 2, industry: 'Financial Services' },
        { name: 'HealthTech Innovations', summary: 'A healthcare technology company developing advanced medical devices and software.', slots: 2, industry: 'Healthcare' },
        { name: 'GlobalLogistics Pro', summary: 'An international logistics company specializing in supply chain management and optimization.', slots: 2, industry: 'Logistics' },
      ]);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Dashboard students={students} companies={companies} />
      </div>
    </div>
  );
};

export default Index;
