import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    totalStudents: Math.max(0, students.length),
    totalCompanies: Math.max(0, companies.length),
    successfulMatches: Math.max(0, students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length),
    pendingMatches: Math.max(0, students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length),
  };

  const matchStatusData = [
    { name: 'Successful Matches', value: stats.successfulMatches },
    { name: 'Pending Matches', value: stats.pendingMatches },
    { name: 'Unmatched', value: Math.max(0, stats.totalStudents - stats.successfulMatches - stats.pendingMatches) },
  ];

  const studentsVsCompanies = [
    { name: 'Students', count: stats.totalStudents },
    { name: 'Companies', count: stats.totalCompanies },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Simulated AI matching accuracy
  const aiMatchingAccuracy = Math.min(100, Math.max(0, 85.5));

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="col-span-4 grid grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">{key.split(/(?=[A-Z])/).join(' ')}</h3>
            <p className="text-2xl font-semibold">{value}</p>
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
            <PieChart>
              <Pie
                data={studentsVsCompanies}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {studentsVsCompanies.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Student Match Status</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={matchStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {matchStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
