import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { MatchingViewRow } from '../components/MatchingViewRow';
import { generateCSV, downloadCSV } from '../utils/csvUtils';
import Sidebar from '../components/Sidebar';

const MatchingView = () => {
  const [companies, setCompanies] = useState(() => {
    const savedCompanies = localStorage.getItem('companies');
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });

  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
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

  const handleDownloadCSV = () => {
    const csvContent = generateCSV(students);
    downloadCSV(csvContent, 'student_company_matching.csv');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Student-Company Matching</CardTitle>
              <Button onClick={handleDownloadCSV}>Download CSV</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Company 1</TableHead>
                    <TableHead>1st Outcome</TableHead>
                    <TableHead>Company 2</TableHead>
                    <TableHead>2nd Outcome</TableHead>
                    <TableHead>Backup Company</TableHead>
                    <TableHead>Actions</TableHead>
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
      </div>
    </div>
  );
};

export default MatchingView;