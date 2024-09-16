import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const MatchingView = () => {
  // Fake data for student-company matching
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', faculty: 'Law', company1: 'LawFirm A', company2: 'LawFirm B', outcome: 'Pending', match1: 85, match2: 75 },
    { id: 2, name: 'Jane Smith', faculty: 'Finance', company1: 'Bank X', company2: 'Investment Y', outcome: 'Accepted', match1: 92, match2: 88 },
    { id: 3, name: 'Bob Johnson', faculty: 'Marketing', company1: 'Agency M', company2: 'Brand N', outcome: 'Pending', match1: 78, match2: 82 },
  ]);

  const handleAccept = (studentId, company) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, outcome: 'Accepted', company2: company === 'company1' ? '' : student.company2 };
      }
      return student;
    }));
  };

  const handleReject = (studentId, company) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updatedStudent = { ...student };
        if (company === 'company1') {
          updatedStudent.company1 = updatedStudent.company2;
          updatedStudent.match1 = updatedStudent.match2;
          updatedStudent.company2 = '';
          updatedStudent.match2 = 0;
        } else {
          updatedStudent.company2 = '';
          updatedStudent.match2 = 0;
        }
        return updatedStudent;
      }
      return student;
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Student-Company Matching</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Faculty</TableHead>
            <TableHead>Company 1</TableHead>
            <TableHead>Company 2</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.faculty}</TableCell>
              <TableCell>{student.company1} ({student.match1}%)</TableCell>
              <TableCell>{student.company2} {student.match2 ? `(${student.match2}%)` : ''}</TableCell>
              <TableCell>{student.outcome}</TableCell>
              <TableCell>
                {student.outcome === 'Pending' && (
                  <>
                    <Button onClick={() => handleAccept(student.id, 'company1')} className="mr-2">Accept 1</Button>
                    {student.company2 && <Button onClick={() => handleAccept(student.id, 'company2')}>Accept 2</Button>}
                  </>
                )}
                {student.outcome === 'Accepted' && (
                  <Button onClick={() => handleReject(student.id, 'company1')} variant="destructive">Reject</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchingView;