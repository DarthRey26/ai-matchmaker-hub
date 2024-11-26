import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";
import Sidebar from '../components/Sidebar';

const ModelComparison = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Choose Your Matching Model</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Iris Homemade Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/matching/process')}
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
          <Card className="opacity-75">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-purple-500" />
                Iris Stacked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Advanced AI-powered matching using deep learning and natural language processing.</p>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Pay per use
                  </span>
                  <span className="text-sm text-gray-500">(Coming Soon)</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Advanced ML algorithms</li>
                  <li>• Deep semantic analysis</li>
                  <li>• Contextual understanding</li>
                  <li>• Detailed analytics dashboard</li>
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