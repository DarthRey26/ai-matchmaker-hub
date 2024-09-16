import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    totalStudents: students.length,
    totalCompanies: companies.length,
    successfulMatches: students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length,
    pendingMatches: students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length,
  };

  const chartData = companies.map(company => ({
    name: company.name,
    students: students.filter(s => s.company1 === company.name || s.company2 === company.name).length,
    matches: students.filter(s => (s.company1 === company.name && s.outcome1 === 'Accepted') || (s.company2 === company.name && s.outcome2 === 'Accepted')).length,
  }));

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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8884d8" name="Students" />
            <Bar dataKey="matches" fill="#82ca9d" name="Matches" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;
