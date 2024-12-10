import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CostTracker = ({ tokensUsed }) => {
  // OpenAI pricing (as of 2024)
  const COST_PER_1K_TOKENS = 0.0001;
  const totalCost = (tokensUsed / 1000) * COST_PER_1K_TOKENS;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Tokens Used:</span>
            <span className="font-medium">{tokensUsed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Cost:</span>
            <span className="font-medium">${totalCost.toFixed(4)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Cost is calculated based on current OpenAI API pricing for text-embedding-ada-002 model.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostTracker;