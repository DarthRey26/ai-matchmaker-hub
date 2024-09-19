import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { Button } from "@/components/ui/button";

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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Dashboard students={students} companies={companies} />
        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Actions</h2>
            <div className="space-x-4">
              <Link to="/matching">
                <Button className="w-full sm:w-auto">Go to Student-Company Matching</Button>
              </Link>
              <Link to="/documents">
                <Button className="w-full sm:w-auto">View Documents</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
