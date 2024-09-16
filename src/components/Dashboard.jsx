import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Fake data for the dashboard
  const stats = {
    totalStudents: 150,
    totalCompanies: 50,
    successfulMatches: 75,
    pendingMatches: 25,
  };

  const chartData = [
    { industry: 'Law', students: 40, companies: 15, matches: 20 },
    { industry: 'Finance', students: 50, companies: 20, matches: 30 },
    { industry: 'Marketing', students: 30, companies: 10, matches: 15 },
    { industry: 'Engineering', students: 30, companies: 5, matches: 10 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Students</h3>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Companies</h3>
          <p className="text-3xl font-bold">{stats.totalCompanies}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Successful Matches</h3>
          <p className="text-3xl font-bold">{stats.successfulMatches}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Pending Matches</h3>
          <p className="text-3xl font-bold">{stats.pendingMatches}</p>
        </Card>
      </div>
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Matching Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="industry" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8884d8" />
            <Bar dataKey="companies" fill="#82ca9d" />
            <Bar dataKey="matches" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;