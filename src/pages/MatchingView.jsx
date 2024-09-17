import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MatchingViewRow } from '../components/MatchingViewRow';

const MatchingView = () => {
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem('companies');
    return savedCompanies ? JSON.parse(savedCompanies) : [
      { name: 'KC Partnership', summary: 'A leading law firm specializing in corporate law and mergers & acquisitions.', slots: 2 },
      { name: 'Watson Farley & Williams', summary: 'An international law firm focusing on energy, maritime, and infrastructure sectors.', slots: 2 },
      { name: 'Mazars', summary: 'A global audit, tax, and advisory firm helping organizations navigate business complexities.', slots: 2 },
      { name: 'Forvia', summary: 'An automotive technology company developing innovative solutions for future mobility.', slots: 2 },
      { name: 'The Chosen One Agency', summary: 'A creative marketing agency known for its cutting-edge digital campaigns.', slots: 2 },
    ];
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [
      { id: 1, name: 'Adarius', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Pending', company2: 'Watson Farley & Williams', outcome2: 'Pending', backupCompany: '', match1: 85, match2: 92 },
      { id: 2, name: 'Nicole', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Pending', company2: 'Watson Farley & Williams', outcome2: 'Pending', backupCompany: '', match1: 88, match2: 90 },
      { id: 3, name: 'Aidan', school: 'Temasek Poly', faculty: 'Law', company1: 'Watson Farley & Williams', outcome1: 'Pending', company2: 'KC Partnership', outcome2: 'Pending', backupCompany: '', match1: 91, match2: 87 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [students, companies]);

  const handleOutcomeChange = (studentId, companyField, newOutcome) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, [`outcome${companyField.slice(-1)}`]: newOutcome };
      }
      return student;
    }));
  };

  const handleReassign = (studentId, companyField, newCompany) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { 
          ...student, 
          [companyField]: newCompany, 
          [`match${companyField.slice(-1)}`]: Math.floor(Math.random() * 20) + 80
        };
      }
      return student;
    }));
  };

  const handleBackupCompanyChange = (studentId, newBackupCompany) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, backupCompany: newBackupCompany };
      }
      return student;
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student-Company Matching</h1>
        <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Dashboard
        </Link>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2}>Student Name</TableHead>
                <TableHead rowSpan={2}>School</TableHead>
                <TableHead rowSpan={2}>Faculty</TableHead>
                <TableHead colSpan={2}>Company 1</TableHead>
                <TableHead colSpan={2}>Company 2</TableHead>
                <TableHead rowSpan={2}>Backup Company</TableHead>
                <TableHead rowSpan={2}>Actions</TableHead>
              </TableRow>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <MatchingViewRow
                  key={student.id}
                  student={student}
                  companies={companies}
                  onOutcomeChange={handleOutcomeChange}
                  onReassign={handleReassign}
                  onBackupCompanyChange={handleBackupCompanyChange}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchingView;
