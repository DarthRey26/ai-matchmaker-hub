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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const MatchingTable = ({ matchingData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Processing matches...</span>
      </div>
    );
  }

  if (!matchingData || matchingData.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No matching data available</p>
      </div>
    );
  }

  const formatName = (name) => {
    if (!name) return 'Unknown';
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
          <TableHead>Top Matches</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchingData.map((match, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {formatName(match.student)}
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                {match.matches.map((companyMatch, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{formatName(companyMatch.company_name)}</span>
                    {companyMatch.matchScore && (
                      <Badge variant={companyMatch.matchScore >= 70 ? "success" : "secondary"}>
                        {companyMatch.matchScore.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </TableCell>
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
                            {companyMatch.role && (
                              <p className="text-sm text-gray-500">{companyMatch.role}</p>
                            )}
                          </div>
                          {companyMatch.matchScore && (
                            <div className="text-right">
                              <span className="text-xl font-bold">
                                {companyMatch.matchScore.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {companyMatch.matchScore && (
                          <Progress 
                            value={companyMatch.matchScore} 
                            className="mb-4"
                          />
                        )}

                        {companyMatch.explanation && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Match Analysis</h4>
                            <p className="text-sm text-gray-600">
                              {companyMatch.explanation}
                            </p>
                          </div>
                        )}

                        {companyMatch.details && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Position Details</h4>
                            {companyMatch.details.requirements?.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-600 mb-2">Requirements</h5>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {companyMatch.details.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {companyMatch.details.jobDescriptions?.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-600 mb-2">Job Description</h5>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                  {companyMatch.details.jobDescriptions.map((desc, i) => (
                                    <li key={i}>{desc.description}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
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