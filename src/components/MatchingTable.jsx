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
  console.log('Matching Data received:', matchingData);

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

  const getMatchColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "secondary";
  };

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
          <TableHead className="w-[200px]">Student Name</TableHead>
          <TableHead>Top Matches</TableHead>
          <TableHead className="w-[150px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matchingData.map((match, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {formatName(match.student)}
            </TableCell>
            <TableCell>
              <div className="space-y-3">
                {match.matches && match.matches.length > 0 ? (
                  match.matches.map((companyMatch, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatName(companyMatch.company_name)}</span>
                        <span className="text-sm text-gray-500">{companyMatch.role || 'Role not specified'}</span>
                      </div>
                      {companyMatch.matchScore && (
                        <Badge variant={getMatchColor(companyMatch.matchScore)}>
                          {companyMatch.matchScore.toFixed(1)}% Match
                        </Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No suitable matches found</div>
                )}
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
                  <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                    {match.matches && match.matches.map((companyMatch, idx) => (
                      <div key={idx} className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">
                              {formatName(companyMatch.company_name)}
                            </h3>
                            {companyMatch.role && (
                              <p className="text-gray-600">{companyMatch.role}</p>
                            )}
                          </div>
                          {companyMatch.matchScore && (
                            <div className="text-right">
                              <Badge variant={getMatchColor(companyMatch.matchScore)} className="text-lg px-3 py-1">
                                {companyMatch.matchScore.toFixed(1)}%
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">Match Score</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <h4 className="font-medium mb-2">Skills Match</h4>
                            <Progress 
                              value={companyMatch.skillsMatch || 0} 
                              className="h-2"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              {companyMatch.skillsMatch?.toFixed(1)}% of required skills matched
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Experience Match</h4>
                            <Progress 
                              value={companyMatch.experienceMatch || 0} 
                              className="h-2"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              {companyMatch.experienceMatch?.toFixed(1)}% experience relevance
                            </p>
                          </div>
                        </div>

                        {companyMatch.matchExplanation && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-blue-700">Match Analysis</h4>
                            <p className="text-sm text-blue-600">
                              {companyMatch.matchExplanation}
                            </p>
                          </div>
                        )}

                        {companyMatch.requirements && companyMatch.requirements.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Company Requirements</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {companyMatch.requirements.map((req, i) => (
                                <li key={i} className="text-sm text-gray-600">{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {companyMatch.studentStrengths && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Student Strengths</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {companyMatch.studentStrengths.map((strength, i) => (
                                <li key={i} className="text-sm text-gray-600">{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {companyMatch.improvementAreas && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Areas for Improvement</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {companyMatch.improvementAreas.map((area, i) => (
                                <li key={i} className="text-sm text-gray-600">{area}</li>
                              ))}
                            </ul>
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