import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, AlertCircle } from "lucide-react";

const MatchingResults = ({ matches, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Processing matches...</span>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-gray-500">
            <AlertCircle className="mr-2" />
            <p>No matches found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {matches.map((match, index) => (
        <Card key={index} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{match.student}</span>
              <Badge variant="secondary">
                {match.matches.length === 1 && match.matches[0].company_name === "No Matches Found" 
                  ? "No Matches" 
                  : `Top ${match.matches.length} Matches`}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {match.matches.map((companyMatch, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {companyMatch.company_name}
                        </h3>
                        {companyMatch.role && (
                          <p className="text-sm text-gray-600">{companyMatch.role}</p>
                        )}
                      </div>
                      {companyMatch.company_name !== "No Matches Found" && (
                        <div className="flex items-center">
                          <span className="text-xl font-bold">
                            {Number(companyMatch.matchScore).toFixed(1)}%
                          </span>
                          {companyMatch.matchScore > 80 ? (
                            <Check className="ml-2 h-5 w-5 text-green-500" />
                          ) : companyMatch.matchScore < 40 ? (
                            <X className="ml-2 h-5 w-5 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    
                    {companyMatch.company_name !== "No Matches Found" && (
                      <Progress 
                        value={Number(companyMatch.matchScore)} 
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

                    {companyMatch.details && companyMatch.company_name !== "No Matches Found" && (
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
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatchingResults;