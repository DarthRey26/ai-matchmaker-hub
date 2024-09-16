import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MatchingViewRow } from '../components/MatchingViewRow';
import { DetailDialog } from '../components/DetailDialog';

const MatchingView = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Adarius', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Spot Taken', company2: 'Watson Farley & Williams', outcome2: 'Accepted', backupCompany: '', match1: 85, match2: 92 },
    { id: 2, name: 'Nicole', school: 'Temasek Poly', faculty: 'Law', company1: 'KC Partnership', outcome1: 'Spot Taken', company2: 'Watson Farley & Williams', outcome2: 'Spot Taken', backupCompany: '', match1: 88, match2: 90 },
    { id: 3, name: 'Aidan', school: 'Temasek Poly', faculty: 'Law', company1: 'Watson Farley & Williams', outcome1: 'Spot Taken', company2: 'KC Partnership', outcome2: 'Accepted', backupCompany: '', match1: 91, match2: 87 },
  ]);

  const [companies] = useState([
    'KC Partnership', 'Watson Farley & Williams', 'Mazars', 'Forvia', 'The Chosen One Agency', 'West Eden', 'Greydient Lab', 'Golden Eye Corp', 'Threaded Creatives', 'Spunn', 'Kommune Agency'
  ]);

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
