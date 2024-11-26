import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

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
                <h3 className="text-lg font-semibold">
                  {companyMatch.companyName} 
                  {companyMatch.role && <span className="text-sm text-gray-500 ml-2">({companyMatch.role})</span>}
                </h3>
                <span className="text-xl font-bold">{companyMatch.probability.toFixed(2)}%</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Skills Match</span>
                    <span>{companyMatch.qualityMetrics.skillFit.toFixed(2)}%</span>
                  </div>
                  <Progress value={companyMatch.qualityMetrics.skillFit} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Experience Match</span>
                    <span>{companyMatch.qualityMetrics.experienceFit.toFixed(2)}%</span>
                  </div>
                  <Progress value={companyMatch.qualityMetrics.experienceFit} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Quality</span>
                    <span>{companyMatch.qualityMetrics.overallQuality.toFixed(2)}%</span>
                  </div>
                  <Progress value={companyMatch.qualityMetrics.overallQuality} className="h-2" />
                </div>

                {companyMatch.matchedSkills && (
                  <div>
                    <h4 className="font-medium mb-2">Matched Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {companyMatch.matchedSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
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