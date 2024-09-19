import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    totalStudents: students.length,
    totalCompanies: companies.length,
    successfulMatches: students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length,
    pendingMatches: students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length,
  };

  const matchStatusData = [
    { name: 'Successful Matches', value: Math.max(0, stats.successfulMatches) },
    { name: 'Pending Matches', value: Math.max(0, stats.pendingMatches) },
    { name: 'Unmatched', value: Math.max(0, stats.totalStudents - stats.successfulMatches - stats.pendingMatches) },
  ];

  const studentsVsCompanies = [
    { name: 'Students', count: Math.max(0, stats.totalStudents) },
    { name: 'Companies', count: Math.max(0, stats.totalCompanies) },
  ];

  // Simulated AI matching accuracy
  const aiMatchingAccuracy = Math.min(100, Math.max(0, 85.5));

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="col-span-4 grid grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">{key.split(/(?=[A-Z])/).join(' ')}</h3>
            <p className="text-2xl font-semibold">{Math.max(0, value)}</p>
          </div>
        ))}
        <div className={`p-4 rounded-lg shadow ${aiMatchingAccuracy >= 80 ? "bg-green-100" : "bg-red-100"}`}>
          <h3 className="text-sm font-medium text-gray-500">AI Matching Accuracy</h3>
          <p className="text-2xl font-semibold">{aiMatchingAccuracy.toFixed(1)}%</p>
          {aiMatchingAccuracy < 80 && (
            <p className="text-red-600 text-xs mt-1">Retraining necessary</p>
          )}
        </div>
      </Card>
      
      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Students vs Companies</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentsVsCompanies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Student Match Status</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={matchStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
