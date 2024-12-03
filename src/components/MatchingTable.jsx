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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MatchingTable = ({ matchingData, onStatusChange }) => {
  const statusColors = {
    'Accepted': 'bg-green-100',
    'Rejected': 'bg-red-100',
    'Pending': 'bg-yellow-100',
    'Not Yet': 'bg-purple-100'
  };

  const handleViewPDF = (filePath) => {
    // Using the existing uploads endpoint from the server
    const pdfUrl = `http://localhost:3001${filePath.replace(/^backend/, '')}`;
    window.open(pdfUrl, '_blank');
  };

  const validMatchingData = matchingData.filter(student => 
    student.matches && student.matches.length >= 2
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Company 1</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Company 2</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {validMatchingData.map((student, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {student.studentName}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewPDF(student.filePath)}
                >
                  View Resume
                </Button>
              </div>
            </TableCell>
            {student.matches.slice(0, 2).map((match, idx) => (
              <React.Fragment key={idx}>
                <TableCell>
                  <div>{match.company_name}</div>
                  <div className="text-sm text-gray-500">
                    Match: {Number(match.bidirectionalScore * 100).toFixed(2)}%
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPDF(match.filePath)}
                    >
                      View Job Details
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{match.role}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => onStatusChange(student.studentName, idx === 0 ? 'outcome1' : 'outcome2', value)}
                    defaultValue={match.status || 'Not Yet'}
                  >
                    <SelectTrigger className={`w-[120px] ${statusColors[match.status || 'Not Yet']}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Not Yet">Not Yet</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </React.Fragment>
            ))}
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => toast.info("Detailed view coming soon!")}>
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MatchingTable;