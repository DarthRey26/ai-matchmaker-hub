import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const DetailDialog = ({ student }) => {
  // This is a mock function to simulate AI-generated summaries
  const generateAISummary = (data) => {
    return `${data.name} is a ${data.faculty} student at ${data.school}. They have shown strong aptitude in their field and have a particular interest in ${data.company1} and ${data.company2}.`;
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
          <h3 className="text-lg font-semibold mb-2">AI-Generated Summary</h3>
          <p>{studentSummary}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Match Details</h3>
          <p><strong>{student.company1}:</strong> {student.match1}% match</p>
          <p><strong>{student.company2}:</strong> {student.match2}% match</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};