import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Sidebar from '../components/Sidebar';
import { Play, StopCircle, Loader2 } from 'lucide-react';

const MatchingView = () => {
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(false);
  const [controller, setController] = useState(null);

  const handleStartMatching = async () => {
    setIsMatching(true);
    const abortController = new AbortController();
    setController(abortController);

    try {
      navigate('/matching/process');
      toast.success('Starting matching process...');
    } catch (error) {
      toast.error('Failed to start matching process');
      console.error('Matching error:', error);
      setIsMatching(false);
    }
  };

  const handleStopMatching = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setIsMatching(false);
      toast.info('Matching process interrupted');
    }
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
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Click below to start the AI-powered matching process. Our system will analyze student resumes 
              and company requirements to find the best matches.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={handleStartMatching}
                disabled={isMatching}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isMatching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Matching
                  </>
                )}
              </Button>
              {isMatching && (
                <Button 
                  onClick={handleStopMatching}
                  variant="destructive"
                  className="w-1/3"
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchingView;