import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import { generateCSV, downloadCSV } from '../utils/csvUtils';
import MatchingTable from '../components/MatchingTable';
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const MatchingProcess = () => {
  const [matchingData, setMatchingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatchingData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/matching-data');
      if (!response.ok) throw new Error('Failed to fetch matching data');
      const data = await response.json();
      setMatchingData(data.matches);
    } catch (err) {
      toast.error('Failed to fetch matching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchingData();
  }, []);

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
                <CardTitle>Matching Results</CardTitle>
                <Button 
                  onClick={handleDownloadCSV}
                  disabled={!matchingData.length || isLoading}
                >
                  Download CSV
                </Button>
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
              ) : (
                <MatchingTable 
                  matchingData={matchingData}
                  onStatusChange={() => {}}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingProcess;