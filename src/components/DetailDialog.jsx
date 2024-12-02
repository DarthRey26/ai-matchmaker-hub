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
                  <h3 className="text-lg font-semibold">
                    {companyMatch.company_name !== 'Company Not Found' 
                      ? companyMatch.company_name 
                      : 'Company Name Not Available'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {companyMatch.role !== 'Role Not Specified' 
                      ? companyMatch.role 
                      : 'Role Not Specified'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold">
                    {(companyMatch.bidirectionalScore * 100).toFixed(1)}%
                  </span>
                  <p className="text-sm text-gray-500">Match Score</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Skills Match</span>
                    <span>{companyMatch.details.student.skillMatch.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={companyMatch.details.student.skillMatch}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Experience Match</span>
                    <span>{companyMatch.details.student.experienceMatch.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={companyMatch.details.student.experienceMatch}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Quality</span>
                    <span>{(companyMatch.bidirectionalScore * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={companyMatch.bidirectionalScore * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};