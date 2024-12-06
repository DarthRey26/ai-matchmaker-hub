import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";

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
          <p className="text-center text-gray-500">No matches found</p>
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
              <span>{match.studentName || match.student}</span>
              <Badge variant="secondary">
                Top {match.matches.length} Matches
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {match.matches.map((companyMatch, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {companyMatch.company_name || companyMatch.companyName}
                      </h3>
                      <div className="flex items-center">
                        {Number(companyMatch.matchScore || companyMatch.probability || companyMatch.similarity_score * 100).toFixed(1)}%
                        {companyMatch.matchScore > 80 ? (
                          <Check className="ml-2 h-5 w-5 text-green-500" />
                        ) : companyMatch.matchScore < 40 ? (
                          <X className="ml-2 h-5 w-5 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    <Progress 
                      value={Number(companyMatch.matchScore || companyMatch.probability || companyMatch.similarity_score * 100)} 
                      className="mb-4"
                    />
                    {companyMatch.explanation && (
                      <p className="text-sm text-gray-600 mt-2">
                        {companyMatch.explanation}
                      </p>
                    )}
                    {companyMatch.details && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Match Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Skills Match</span>
                            <Progress value={companyMatch.details.skillFit} className="mt-1" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Experience Match</span>
                            <Progress value={companyMatch.details.experienceFit} className="mt-1" />
                          </div>
                        </div>
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