import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const students = [
    { id: 1, name: 'Adarius', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Pending', company2: 'Watson Farley & Williams', outcome2: 'Pending', backupCompany: '', match1: 85, match2: 92 },
    { id: 2, name: 'Nicole', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Pending', company2: 'Watson Farley & Williams', outcome2: 'Pending', backupCompany: '', match1: 88, match2: 90 },
    { id: 3, name: 'Aidan', school: 'Temasek Poly', faculty: 'Law', company1: 'Watson Farley & Williams', outcome1: 'Pending', company2: 'KC Partnership', outcome2: 'Pending', backupCompany: '', match1: 91, match2: 87 },
  ];

  const companies = [
    { name: 'KC Partnership', summary: 'A leading law firm specializing in corporate law and mergers & acquisitions.' },
    { name: 'Watson Farley & Williams', summary: 'An international law firm focusing on energy, maritime, and infrastructure sectors.' },
    { name: 'Mazars', summary: 'A global audit, tax, and advisory firm helping organizations navigate business complexities.' },
    { name: 'Forvia', summary: 'An automotive technology company developing innovative solutions for future mobility.' },
    { name: 'The Chosen One Agency', summary: 'A creative marketing agency known for its cutting-edge digital campaigns.' },
  ];

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
        </div>
      </main>
    </div>
  );
};

export default Index;
