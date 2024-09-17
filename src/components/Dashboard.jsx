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

  const chartData = companies.map(company => ({
    name: company.name,
    slots: company.slots || 2,
    matches: students.filter(s => 
      (s.company1 === company.name && s.outcome1 === 'Accepted') || 
      (s.company2 === company.name && s.outcome2 === 'Accepted')
    ).length,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {key.split(/(?=[A-Z])/).join(' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Company Slots and Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="slots" fill="#8884d8" name="Available Slots" />
              <Bar dataKey="matches" fill="#82ca9d" name="Successful Matches" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
