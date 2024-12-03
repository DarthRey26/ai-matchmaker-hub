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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MatchingTable = ({ matchingData, onStatusChange, accuracyReport }) => {
  const statusColors = {
    'Accepted': 'bg-green-100',
    'Rejected': 'bg-red-100',
    'Pending': 'bg-yellow-100',
    'Not Yet': 'bg-purple-100'
  };

  // Add validation check for matches
  const validMatchingData = matchingData.filter(student => 
    student.matches && student.matches.length >= 2
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Company 1</TableHead>
          <TableHead>1st Outcome</TableHead>
          <TableHead>Company 2</TableHead>
          <TableHead>2nd Outcome</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {validMatchingData.map((student, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{student.studentName}</TableCell>
            {student.matches.map((match, idx) => (
              <React.Fragment key={idx}>
                <TableCell>
                  <div>{match?.company_name || 'No Company'}</div>
                  <div className="text-sm text-gray-500">
                    {match?.probability ? Number(match.probability).toFixed(2) : (match.bidirectionalScore * 100).toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => onStatusChange(student.studentName, idx === 0 ? 'outcome1' : 'outcome2', value)}
                    defaultValue={match?.status || 'Not Yet'}
                  >
                    <SelectTrigger className={`w-[120px] ${statusColors[match?.status || 'Not Yet']}`}>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">View Details</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Match Quality Details - {student.studentName}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      {student.matches.map((match, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{match?.company_name || 'No Company'}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Skills Fit:</span>
                              <span className="font-medium">
                                {Number(match?.details?.student?.skillMatch || 0).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Experience Fit:</span>
                              <span className="font-medium">
                                {Number(match?.details?.student?.experienceMatch || 0).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Overall Quality:</span>
                              <span>
                                {Number((match?.bidirectionalScore || 0) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MatchingTable;