import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Dashboard = () => {
  const { data: documentsData } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/documents');
      return response.data;
    }
  });

  const { data: matchingData } = useQuery({
    queryKey: ['matching-data'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3001/api/matching-data');
      return response.data;
    }
  });

  const stats = {
    'Total Students': documentsData?.students?.length || 0,
    'Total Companies': documentsData?.companies?.length || 0,
    'Successful Matches': matchingData?.matches?.filter(m => 
      m.matches.some(match => match.status === 'Accepted')
    ).length || 0,
    'Pending Matches': matchingData?.matches?.filter(m => 
      m.matches.some(match => match.status === 'Pending')
    ).length || 0,
    'Average Match Accuracy': matchingData?.matches 
      ? (matchingData.matches.reduce((acc, curr) => 
          acc + curr.matches.reduce((sum, m) => sum + m.probability, 0) / curr.matches.length, 
          0) / matchingData.matches.length * 100).toFixed(1)
      : 0,
  };

  // Prepare data for visualizations
  const matchQualityData = matchingData?.matches?.map(match => ({
    name: match.studentName,
    'Match Quality': match.matches[0]?.probability || 0,
  })) || [];

  const matchStatusData = [
    { name: 'Accepted', value: stats['Successful Matches'] },
    { name: 'Pending', value: stats['Pending Matches'] },
    { name: 'Not Yet', value: (matchingData?.matches?.length || 0) - (stats['Successful Matches'] + stats['Pending Matches']) }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return percent > 0 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
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
          <h2 className="text-xl font-semibold p-4">Match Quality by Student</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Match Quality" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-xl font-semibold p-4">Match Status Distribution</h2>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {matchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;