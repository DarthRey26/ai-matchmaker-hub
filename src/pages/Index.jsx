import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Index = () => {
  const { data: documentsData, isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/documents');
      return response.data;
    }
  });

  const { data: matchingData, isLoading: isMatchingLoading } = useQuery({
    queryKey: ['matching-data'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/matching-data');
      return response.data;
    }
  });

  if (isDocumentsLoading || isMatchingLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const stats = {
    'Total Students': documentsData?.students?.length || 0,
    'Total Companies': documentsData?.companies?.length || 0,
    'Successful Matches': matchingData?.matches?.filter(m => 
      m.matches.some(match => match.status === 'Accepted')
    ).length || 0,
    'Pending Matches': matchingData?.matches?.filter(m => 
      m.matches.some(match => match.status === 'Pending')
    ).length || 0
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-500">{key}</h3>
                <p className="text-2xl font-semibold mt-2">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;