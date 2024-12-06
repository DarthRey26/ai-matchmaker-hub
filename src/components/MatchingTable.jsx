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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const MatchingTable = ({ matchingData, onStatusChange }) => {
  const statusColors = {
    'Accepted': 'bg-green-100',
    'Rejected': 'bg-red-100',
    'Pending': 'bg-yellow-100',
    'Not Yet': 'bg-purple-100'
  };

  const formatName = (name) => {
    return name
      .replace(/^\d+-/, '')
      .replace(/_/g, ' ')
      .replace(/\.pdf$/, '')
      .replace(/Resume/gi, '')
      .trim();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Company 1</TableHead>
          <TableHead>1st Outcome</TableHead>
          <TableHead>Company 2</TableHead>
          <TableHead>2nd Outcome</TableHead>
          <TableHead>Company 3</TableHead>
          <TableHead>3rd Outcome</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchingData.map((match, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {formatName(match.student)}
            </TableCell>
            {match.matches.map((companyMatch, idx) => (
              <React.Fragment key={idx}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{formatName(companyMatch.company_name)}</span>
                    <span className="text-sm text-gray-500">
                      {companyMatch.matchScore.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => onStatusChange(match.student, idx === 0 ? 'outcome1' : 'outcome2', value)}
                    defaultValue="Not Yet"
                  >
                    <SelectTrigger className={`w-[120px] ${statusColors['Not Yet']}`}>
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
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Match Details for {formatName(match.student)}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    {match.matches.map((companyMatch, idx) => (
                      <div key={idx} className="mb-6 p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {formatName(companyMatch.company_name)}
                            </h3>
                            <p className="text-sm text-gray-500">{companyMatch.role}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold">
                              {companyMatch.matchScore.toFixed(1)}%
                            </span>
                            <p className="text-sm text-gray-500">Match Score</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Match Explanation</h4>
                          <p className="text-sm text-gray-600">{companyMatch.explanation}</p>
                        </div>
                        <div className="mt-4">
                          <Progress value={companyMatch.matchScore} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
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