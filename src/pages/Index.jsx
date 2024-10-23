import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';

const Index = () => {
  const [matchingResults, setMatchingResults] = useState([]);

  useEffect(() => {
    fetchMatchingResults();
  }, []);

  const fetchMatchingResults = async () => {
    try {
      const response = await fetch('/api/process-and-match');
      const data = await response.json();
      setMatchingResults(data);
    } catch (error) {
      console.error('Error fetching matching results:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <Dashboard />
          <h1>Student-Company Matching Results</h1>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Company Name</th>
                <th>Match Probability</th>
              </tr>
            </thead>
            <tbody>
              {matchingResults.map((result, index) => (
                <tr key={index}>
                  <td>{result['Student Name']}</td>
                  <td>{result['Company Name']}</td>
                  <td>{result['Match Probability']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Index;
