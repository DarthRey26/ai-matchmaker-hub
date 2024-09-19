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
    }
    
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Dashboard students={students} companies={companies} />
      </div>
    </div>
  );
};

export default Index;
