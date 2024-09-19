import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    'Total Students': students.length,
    'Total Companies': companies.length,
    'Successful Matches': students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length,
    'Pending Matches': students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length,
    'Average Match Accuracy': Math.round(students.reduce((acc, s) => acc + s.match1 + s.match2, 0) / (students.length * 2)),
  };

  const studentsVsCompanies = [
    { name: 'Students', count: students.length },
    { name: 'Companies', count: companies.length },
  ];

  const matchStatusData = [
    { name: 'Successful Matches', value: stats['Successful Matches'], color: '#4CAF50' },
    { name: 'Pending Matches', value: stats['Pending Matches'], color: '#FFC107' },
    { name: 'Unmatched', value: students.length - stats['Successful Matches'] - stats['Pending Matches'], color: '#F44336' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100">
      <h1 className="text-3xl font-bold">IRIS - AI-Powered Student-Company Matching</h1>
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key} className={key === 'Average Match Accuracy' && value > 80 ? 'bg-green-100' : ''}>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">{key}</h3>
              <p className="text-2xl font-semibold">{typeof value === 'number' ? value : 'N/A'}{key.includes('Accuracy') ? '%' : ''}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Students vs Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsVsCompanies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Student Match Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={matchStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count">
                  {matchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
