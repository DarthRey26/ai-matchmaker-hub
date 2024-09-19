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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Simulated data for company categories and student faculties
  const companyCategories = [
    { name: 'Law Firms', value: 30 },
    { name: 'Tech Companies', value: 20 },
    { name: 'Financial Services', value: 15 },
    { name: 'Consulting', value: 10 },
    { name: 'Others', value: 5 },
  ];

  const studentFaculties = [
    { name: 'Law', value: 15 },
    { name: 'Business', value: 10 },
    { name: 'Engineering', value: 8 },
    { name: 'Computer Science', value: 5 },
    { name: 'Others', value: 2 },
  ];

  const studentsVsCompanies = [
    { name: 'Students', count: stats.totalStudents },
    { name: 'Companies', count: stats.totalCompanies },
  ];

  // Simulated AI matching accuracy
  const aiMatchingAccuracy = 85.5;

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
            <BarChart data={studentsVsCompanies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Company Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={companyCategories}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {companyCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Student Faculties</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={studentFaculties}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {studentFaculties.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Student Match Status</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={matchStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {matchStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
