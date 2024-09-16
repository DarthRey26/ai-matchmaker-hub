import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MatchingView = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Adarius', school: 'Temasek Poly', faculty: 'Law', cv: 'KC Partnership', company1: 'KC Partnership', outcome1: 'Spot Taken', company2: 'Watson Farley & Williams', outcome2: 'Accepted', backupCompany: '', match1: 85, match2: 92 },
    { id: 2, name: 'Nicole', school: 'Temasek Poly', faculty: 'Law', cv: 'KC Partnership', company1: 'KC Partnership', outcome1: 'Spot Taken', company2: 'Watson Farley & Williams', outcome2: 'Spot Taken', backupCompany: '', match1: 88, match2: 90 },
    { id: 3, name: 'Aidan', school: 'Temasek Poly', faculty: 'Law', cv: 'Watson Farley & Williams', company1: 'Watson Farley & Williams', outcome1: 'Spot Taken', company2: 'KC Partnership', outcome2: 'Accepted', backupCompany: '', match1: 91, match2: 87 },
    // Add more student data here...
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
          [`match${companyField.slice(-1)}`]: Math.floor(Math.random() * 20) + 80 // Generate a random match percentage between 80-99
        };
      }
      return student;
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student-Company Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>CV</TableHead>
                <TableHead>Company 1</TableHead>
                <TableHead>1st Outcome</TableHead>
                <TableHead>Company 2</TableHead>
                <TableHead>2nd Outcome</TableHead>
                <TableHead>Backup Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.faculty}</TableCell>
                  <TableCell>{student.cv}</TableCell>
                  <CompanyCell
                    student={student}
                    companyField="company1"
                    companies={companies}
                    onReassign={handleReassign}
                  />
                  <OutcomeCell
                    student={student}
                    outcomeField="outcome1"
                    onOutcomeChange={handleOutcomeChange}
                  />
                  <CompanyCell
                    student={student}
                    companyField="company2"
                    companies={companies}
                    onReassign={handleReassign}
                    disabled={student.outcome1 === 'Accepted'}
                  />
                  <OutcomeCell
                    student={student}
                    outcomeField="outcome2"
                    onOutcomeChange={handleOutcomeChange}
                    disabled={student.outcome1 === 'Accepted'}
                  />
                  <TableCell>
                    <Select
                      value={student.backupCompany}
                      onValueChange={(value) => handleReassign(student.id, 'backupCompany', value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select backup" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const CompanyCell = ({ student, companyField, companies, onReassign, disabled }) => {
  return (
    <TableCell>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <span className="mr-2">{student[companyField]}</span>
              <Badge variant="secondary">{student[`match${companyField.slice(-1)}`]}%</Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Match percentage: {student[`match${companyField.slice(-1)}`]}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ReassignDialog
        studentId={student.id}
        companyField={companyField}
        currentCompany={student[companyField]}
        companies={companies}
        onReassign={onReassign}
        disabled={disabled}
      />
    </TableCell>
  );
};

const OutcomeCell = ({ student, outcomeField, onOutcomeChange, disabled }) => {
  const outcomeOptions = ['Pending', 'Accepted', 'Rejected', 'Spot Taken', 'Not Yet'];
  const outcomeColors = {
    'Pending': 'bg-yellow-200 text-yellow-800',
    'Accepted': 'bg-green-200 text-green-800',
    'Rejected': 'bg-red-200 text-red-800',
    'Spot Taken': 'bg-gray-200 text-gray-800',
    'Not Yet': 'bg-purple-200 text-purple-800'
  };

  return (
    <TableCell>
      <Select
        value={student[outcomeField]}
        onValueChange={(value) => onOutcomeChange(student.id, outcomeField, value)}
        disabled={disabled}
      >
        <SelectTrigger className={`w-[120px] ${outcomeColors[student[outcomeField]]}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {outcomeOptions.map((outcome) => (
            <SelectItem key={outcome} value={outcome}>
              {outcome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
};

const ReassignDialog = ({ studentId, companyField, currentCompany, companies, onReassign, disabled }) => {
  const [newCompany, setNewCompany] = useState('');

  const handleReassign = () => {
    if (newCompany && newCompany !== currentCompany) {
      onReassign(studentId, companyField, newCompany);
      setNewCompany('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2" disabled={disabled}>
          Reassign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Company</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select value={newCompany} onValueChange={setNewCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleReassign} disabled={!newCompany || newCompany === currentCompany}>
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchingView;
