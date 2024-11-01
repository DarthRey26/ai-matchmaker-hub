import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import { generateCSV, downloadCSV } from '../utils/csvUtils';
import { MatchManager } from '../utils/matchManager.js';
import MatchingTable from '../components/MatchingTable';
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const MatchingView = () => {
  const [matchingData, setMatchingData] = useState([]);
  const [accuracyReport, setAccuracyReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasStartedMatching, setHasStartedMatching] = useState(false);

  const handleStatusChange = (studentName, outcomeField, newStatus) => {
    setMatchingData(prevData => 
      prevData.map(student => {
        if (student.studentName === studentName) {
          const matches = [...student.matches];
          const matchIndex = outcomeField === 'outcome1' ? 0 : 1;
          matches[matchIndex] = { ...matches[matchIndex], status: newStatus };
          return { ...student, matches };
        }
        return student;
      })
    );
  };

  const fetchMatchingData = async () => {
    setIsLoading(true);
    setHasStartedMatching(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/matching-data');
      if (!response.ok) throw new Error('Failed to fetch matching data');
      const data = await response.json();
      
      const processedData = data.matches.map(student => ({
        ...student,
        matches: student.matches.map(match => ({
          ...match,
          status: 'Not Yet'
        }))
      }));
      
      setMatchingData(processedData);
      setAccuracyReport(data.accuracyReport);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (matchingData.length) {
      const csvData = generateCSV(matchingData);
      downloadCSV(csvData, 'matching-results.csv');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Student-Company Matching</CardTitle>
                <div className="space-x-2">
                  <Button 
                    onClick={fetchMatchingData}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Matching'
                    )}
                  </Button>
                  <Button 
                    onClick={handleDownloadCSV}
                    disabled={!matchingData.length || isLoading}
                  >
                    Download CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-full max-w-md">
                    <div className="mb-4 text-center text-gray-600">
                      Processing Student-Company Matches...
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                </div>
              ) : hasStartedMatching ? (
                <MatchingTable 
                  matchingData={matchingData} 
                  onStatusChange={handleStatusChange}
                  accuracyReport={accuracyReport}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Click "Start Matching" to begin the matching process
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingView;
