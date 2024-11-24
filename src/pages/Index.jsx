import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';

const Index = () => {
  const [matchingResults, setMatchingResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchMatchingResults();
    fetchCurrentData();
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

  const fetchCurrentData = async () => {
    try {
      const response = await fetch('/api/current-data');
      const data = await response.json();
      setStudents(data.students);
      setCompanies(data.companies);
    } catch (error) {
      console.error('Error fetching current data:', error);
    }
  };

  return (
    <div>
      <h1>Student-Company Matching</h1>
      <button onClick={fetchMatchingResults}>Start Matching</button>
      <h2>Current Students</h2>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student.name}</li>
        ))}
      </ul>
      <h2>Current Companies</h2>
      <ul>
        {companies.map((company, index) => (
          <li key={index}>{company.company_name}</li>
        ))}
      </ul>
      <h2>Matching Results</h2>
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
              <td>{result.studentName}</td>
              <td>{result.matches[0]?.companyName || 'N/A'}</td>
              <td>{result.matches[0]?.probability || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Index;
