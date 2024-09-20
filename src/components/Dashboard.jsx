import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';

const Dashboard = ({ students, companies }) => {
  const stats = {
    'Total Students': students.length,
    'Total Companies': companies.length,
    'Successful Matches': students.filter(s => s.outcome1 === 'Accepted' || s.outcome2 === 'Accepted').length,
    'Pending Matches': students.filter(s => s.outcome1 === 'Pending' || s.outcome2 === 'Pending').length,
    'Average Match Accuracy': Math.round(students.reduce((acc, s) => acc + Math.max(s.match1, 0) + Math.max(s.match2, 0), 0) / (students.length * 2)),
  };

  const studentsVsCompanies = [
    { name: 'Students', count: Math.max(students.length, 0) },
    { name: 'Companies', count: Math.max(companies.length, 0) },
  ];

  const matchStatusData = [
    { name: 'Successful Matches', value: Math.max(stats['Successful Matches'], 0), color: '#4CAF50' },
    { name: 'Pending Matches', value: Math.max(stats['Pending Matches'], 0), color: '#FFC107' },
    { name: 'Unmatched', value: Math.max(students.length - stats['Successful Matches'] - stats['Pending Matches'], 0), color: '#F44336' },
  ];

  const facultyData = students.reduce((acc, student) => {
    acc[student.faculty] = (acc[student.faculty] || 0) + 1;
    return acc;
  }, {});

  const facultyChartData = Object.entries(facultyData).map(([name, value]) => ({ name, value }));

  const industryData = companies.reduce((acc, company) => {
    acc[company.industry] = (acc[company.industry] || 0) + 1;
    return acc;
  }, {});

  const industryChartData = Object.entries(industryData).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100 overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">IRIS - AI-Powered Student-Company Matching</h1>
      <div className="grid grid-cols-5 gap-4 mb-4">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key} className={key === 'Average Match Accuracy' && value > 80 ? 'bg-green-100' : ''}>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">{key}</h3>
              <p className="text-2xl font-semibold">{typeof value === 'number' ? value : 'N/A'}{key.includes('Accuracy') ? '%' : ''}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Students vs Companies</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsVsCompanies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Student Match Status</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Students by Faculty</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facultyChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {facultyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Companies by Industry</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
