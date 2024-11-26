import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import { generateCSV, downloadCSV } from '../utils/csvUtils';
import MatchingTable from '../components/MatchingTable';
import { Loader2, User, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MatchingView = () => {
  const navigate = useNavigate();
  const [matchingData, setMatchingData] = useState([]);
  const [documents, setDocuments] = useState({ students: [], companies: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedMatching, setHasStartedMatching] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3001/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      console.log('Fetched documents:', data);
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      toast.error('Failed to fetch documents');
    }
  };

  const handleStartMatching = () => {
    navigate('/model-comparison');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <Card className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Available Documents for Matching</CardTitle>
                <div className="space-x-2">
                  <Button 
                    onClick={handleStartMatching}
                    disabled={!documents.students.length || !documents.companies.length}
                  >
                    Start Matching
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Students ({documents.students?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {documents.students?.map((student, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-sm">
                            {student.formatted}
                          </Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="mr-2 h-5 w-5" />
                      Companies ({documents.companies?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {documents.companies?.map((company, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-sm">
                            {company.formatted}
                          </Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingView;