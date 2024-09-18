import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    totalStudents: students.length,
    totalCompanies: companies.length,
    successfulMatches: students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length,
    pendingMatches: students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length,
  };

  const matchStatusData = [
    { name: 'Successful Matches', value: stats.successfulMatches },
    { name: 'Pending Matches', value: stats.pendingMatches },
    { name: 'Unmatched', value: stats.totalStudents - stats.successfulMatches - stats.pendingMatches },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const topCompanies = companies
    .sort((a, b) => (b.slots || 0) - (a.slots || 0))
    .slice(0, 10)
    .map(company => ({
      name: company.name,
      slots: company.slots || 0,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Companies by Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCompanies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="slots" fill="#8884d8" name="Available Slots" />
                <Bar dataKey="matches" fill="#82ca9d" name="Successful Matches" />
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
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
