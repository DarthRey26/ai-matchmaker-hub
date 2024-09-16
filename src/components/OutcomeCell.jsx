import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const OutcomeCell = ({ student, outcomeField, onOutcomeChange, disabled }) => {
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