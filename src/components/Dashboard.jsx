import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';

const Dashboard = () => {
  const stats = {
    'Total Students': 0,
    'Total Companies': 0,
    'Successful Matches': 0,
    'Pending Matches': 0,
    'Average Match Accuracy': 0,
  };

  const emptyData = [
    { name: 'Category 1', value: 0 },
    { name: 'Category 2', value: 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
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
              <p className="text-2xl font-semibold">{value}{key.includes('Accuracy') ? '%' : ''}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Students vs Companies</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emptyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Student Match Status</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emptyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
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
                  data={emptyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emptyData.map((entry, index) => (
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
                  data={emptyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emptyData.map((entry, index) => (
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
}

export default Dashboard;