import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DetailDialog = ({ student, companies, onBackupCompanyChange }) => {
  const generateAISummary = (data) => {
    return `${data.name} is a ${data.faculty} student at ${data.school}. They have shown strong aptitude in their field and have a particular interest in ${data.company1} and ${data.company2}.`;
  };

  const getCompanySummary = (companyName) => {
    const company = companies.find(c => c.name === companyName);
    return company ? company.summary : 'No summary available.';
  };

  const studentSummary = generateAISummary(student);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{student.name} - Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">AI-Generated Student Summary</h3>
          <p>{studentSummary}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Match Details</h3>
          <p><strong>{student.company1}:</strong> {student.match1}% match</p>
          <p className="mt-2">{getCompanySummary(student.company1)}</p>
          <p className="mt-4"><strong>{student.company2}:</strong> {student.match2}% match</p>
          <p className="mt-2">{getCompanySummary(student.company2)}</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
