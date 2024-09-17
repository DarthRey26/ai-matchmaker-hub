import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DetailDialog = ({ student, companies, onBackupCompanyChange }) => {
  const generateAISummary = (data) => {
    return `${data.name} is a ${data.faculty} student at ${data.school}. They have shown strong aptitude in their field and have a particular interest in ${data.company1} and ${data.company2}.`;
  };

  const getCompanyDetails = (companyName) => {
    const company = companies.find(c => c.name === companyName);
    return company ? {
      name: company.name,
      description: company.description,
      jobDescription: company.jobDescription
    } : {
      name: companyName,
      description: 'No description available.',
      jobDescription: 'No job description available.'
    };
  };

  const studentSummary = generateAISummary(student);
  const company1Details = getCompanyDetails(student.company1);
  const company2Details = getCompanyDetails(student.company2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{student.name} - Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh] pr-4">
          <h3 className="text-lg font-semibold mb-2">AI-Generated Student Summary</h3>
          <p className="mb-4">{studentSummary}</p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Company 1: {company1Details.name}</h3>
          <p className="mb-2"><strong>Match:</strong> {student.match1}%</p>
          <p className="mb-2"><strong>Description:</strong> {company1Details.description}</p>
          <h4 className="text-md font-semibold mt-2 mb-1">Job Description:</h4>
          <p className="whitespace-pre-line">{company1Details.jobDescription}</p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Company 2: {company2Details.name}</h3>
          <p className="mb-2"><strong>Match:</strong> {student.match2}%</p>
          <p className="mb-2"><strong>Description:</strong> {company2Details.description}</p>
          <h4 className="text-md font-semibold mt-2 mb-1">Job Description:</h4>
          <p className="whitespace-pre-line">{company2Details.jobDescription}</p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Backup Company</h3>
          <Select value={student.backupCompany || "none"} onValueChange={(value) => onBackupCompanyChange(student.id, value === "none" ? "" : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select backup company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.name} value={company.name}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
