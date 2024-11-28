import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Sparkles } from "lucide-react";
import Sidebar from '../components/Sidebar';
import { toast } from "sonner";

const ModelComparison = () => {
  const navigate = useNavigate();

  const handleModelSelect = (model) => {
    if (model === 'stacked' && !process.env.OPENAI_API_KEY) {
      toast.error("OpenAI API key is not configured");
      return;
    }
    
    navigate(model === 'homemade' ? '/matching/process' : '/matching/process-ai');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Choose Your Matching Model</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Iris Homemade Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleModelSelect('homemade')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Iris Homemade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Our basic matching algorithm that uses TF-IDF and skill matching to pair students with companies.</p>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Free
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Basic TF-IDF matching</li>
                  <li>• Skill-based compatibility</li>
                  <li>• Experience matching</li>
                  <li>• Basic analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Iris Stacked Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleModelSelect('stacked')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                Iris Stacked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Advanced AI-powered matching using OpenAI's GPT-4 for intelligent student-company pairing.</p>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pay per use
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• AI-powered matching</li>
                  <li>• Deep semantic analysis</li>
                  <li>• Contextual understanding</li>
                  <li>• Advanced analytics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;