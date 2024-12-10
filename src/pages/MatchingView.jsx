import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import { toast } from "sonner";

const MatchingView = () => {
  const navigate = useNavigate();

  const handleStartMatching = () => {
    navigate('/matching/process');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">AI-Powered Student-Company Matching</h1>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Start Matching Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Click below to start the AI-powered matching process. Our system will analyze student resumes 
              and company requirements to find the best matches.
            </p>
            <Button 
              onClick={handleStartMatching}
              className="w-full"
            >
              Start Matching
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchingView;