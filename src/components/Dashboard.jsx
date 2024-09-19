import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    totalStudents: students.length,
    totalCompanies: companies.length,
    successfulMatches: students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length,
    pendingMatches: students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length,
  };

  const studentsVsCompanies = [
    { name: 'Students', count: Math.max(0, stats.totalStudents) },
    { name: 'Companies', count: Math.max(0, stats.totalCompanies) },
  ];

  const matchStatusData = [
    { name: 'Successful Matches', value: Math.max(0, stats.successfulMatches), color: '#4CAF50' },
    { name: 'Pending Matches', value: Math.max(0, stats.pendingMatches), color: '#FFC107' },
    { name: 'Unmatched', value: Math.max(0, stats.totalStudents - stats.successfulMatches - stats.pendingMatches), color: '#F44336' },
  ];

  const facultyData = [
    { name: 'Law', value: 2, color: '#2196F3' },
    { name: 'Engineering', value: 1, color: '#FF9800' },
    { name: 'Business', value: 1, color: '#9C27B0' },
    { name: 'Arts', value: 1, color: '#00BCD4' },
  ];

  const industryData = [
    { name: 'Legal', value: 2, color: '#3F51B5' },
    { name: 'Finance', value: 1, color: '#E91E63' },
    { name: 'Technology', value: 1, color: '#009688' },
    { name: 'Marketing', value: 1, color: '#FF5722' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <h3 className="text-lg font-medium">{key.split(/(?=[A-Z])/).join(' ')}</h3>
              <p className="text-2xl font-semibold">{Math.max(0, value)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Students vs Companies</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
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

      <Card>
        <CardHeader>
          <CardTitle>Match Status</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={matchStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {matchStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Students by Faculty</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={facultyData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {facultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Companies by Industry</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={industryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {industryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
