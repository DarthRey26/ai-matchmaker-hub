import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import { generateCSV, downloadCSV } from '../utils/csvUtils';
import MatchingTable from '../components/MatchingTable';
import CostTracker from '../components/CostTracker';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";

const MatchingProcess = () => {
  const { data: matchingData, isLoading, error } = useQuery({
    queryKey: ['matching'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/matching/enhanced-matching');
      if (!response.ok) throw new Error('Failed to fetch matching data');
      const data = await response.json();
      return data;
    },
  });

  const handleDownloadCSV = () => {
    if (matchingData?.matches?.length) {
      const csvData = generateCSV(matchingData.matches);
      downloadCSV(csvData, 'matching-results.csv');
      toast.success('CSV file downloaded successfully');
    } else {
      toast.error('No data available to download');
    }
  };

  if (error) {
    toast.error('Failed to fetch matching data');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI-Enhanced Matching Results</CardTitle>
                <Button 
                  onClick={handleDownloadCSV}
                  disabled={!matchingData?.matches?.length || isLoading}
                >
                  Download CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MatchingTable 
                matchingData={matchingData?.matches || []}
                isLoading={isLoading}
              />
              {matchingData?.tokensUsed && (
                <CostTracker tokensUsed={matchingData.tokensUsed} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingProcess;