import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";

const MatchingTable = ({ matchingData, onStatusChange }) => {
  const handleViewPDF = (filename) => {
    window.open(`http://localhost:3001/uploads/students/${filename}`, '_blank');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Match Score</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchingData.map((match, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {match.studentName}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => handleViewPDF(match.studentName + '.pdf')}
              >
                <FileIcon className="h-4 w-4 mr-1" />
                View PDF
              </Button>
            </TableCell>
            <TableCell>
              {match.matches[0]?.company_name || 'No Company Match'}
            </TableCell>
            <TableCell>
              {match.matches[0]?.role || 'Role Not Specified'}
            </TableCell>
            <TableCell>
              {match.matches[0]?.bidirectionalScore 
                ? `${(match.matches[0].bidirectionalScore * 100).toFixed(2)}%` 
                : 'N/A'}
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onStatusChange(match.studentName)}>
                Update Status
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MatchingTable;