import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export const DetailDialog = ({ match }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Match Details for {match.studentName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {match.matches.map((companyMatch, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{companyMatch.companyName}</h3>
                  {companyMatch.role && (
                    <p className="text-sm text-gray-500">{companyMatch.role}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold">{companyMatch.probability.toFixed(1)}%</span>
                  <p className="text-sm text-gray-500">Match Score</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Skills Match</span>
                    <span>{companyMatch.qualityMetrics.skillFit.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={companyMatch.qualityMetrics.skillFit} 
                    className="h-2"
                    indicatorClassName={`bg-${companyMatch.qualityMetrics.skillFit > 70 ? 'green' : 'orange'}-500`}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Experience Match</span>
                    <span>{companyMatch.qualityMetrics.experienceFit.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={companyMatch.qualityMetrics.experienceFit} 
                    className="h-2"
                    indicatorClassName={`bg-${companyMatch.qualityMetrics.experienceFit > 70 ? 'green' : 'orange'}-500`}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Quality</span>
                    <span>{companyMatch.qualityMetrics.overallQuality.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={companyMatch.qualityMetrics.overallQuality} 
                    className="h-2"
                    indicatorClassName={`bg-${companyMatch.qualityMetrics.overallQuality > 70 ? 'green' : 'orange'}-500`}
                  />
                </div>

                {companyMatch.matchedSkills && companyMatch.matchedSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {companyMatch.matchedSkills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {companyMatch.role && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Role Details</h4>
                    <p className="text-sm text-gray-600">{companyMatch.role}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};