import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const OutcomeCell = ({ student, outcomeField, onOutcomeChange }) => {
  const outcomeOptions = ['Pending', 'Accepted', 'Rejected', 'Spot Taken', 'Not Yet'];
  const outcomeColors = {
    'Pending': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
    'Accepted': 'bg-green-100 hover:bg-green-200 text-green-800',
    'Rejected': 'bg-red-100 hover:bg-red-200 text-red-800',
    'Spot Taken': 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    'Not Yet': 'bg-purple-100 hover:bg-purple-200 text-purple-800'
  };

  const matchIndex = outcomeField === 'outcome1' ? 0 : 1;
  const isLocked = student.isLocked;
  const currentMatch = student.matches[matchIndex];

  return (
    <TableCell>
      <Select
        value={currentMatch.status}
        onValueChange={(value) => onOutcomeChange(student.studentName, outcomeField, value)}
        disabled={isLocked && currentMatch.status !== 'Accepted'}
      >
        <SelectTrigger className={`w-[160px] ${outcomeColors[currentMatch.status]}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {outcomeOptions.map((outcome) => (
            <SelectItem 
              key={outcome} 
              value={outcome}
              className={outcomeColors[outcome]}
              disabled={isLocked && outcome !== currentMatch.status}
            >
              {outcome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </TableCell>
  );
};