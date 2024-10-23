import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import { generateCSV, downloadCSV, generateCompanyDataCSV } from '../utils/csvUtils';

const MatchingView = () => {
  const [matchingData, setMatchingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMatchingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/matching-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMatchingData(data);
    } catch (error) {
      console.error('Error fetching matching data:', error);
      setError(`Failed to fetch matching data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const csv = generateCSV(matchingData);
    downloadCSV(csv, 'student_company_matching.csv');
  };

  const handleDownloadCompanyData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/company-data');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const csv = generateCompanyDataCSV(data);
      downloadCSV(csv, 'company_data.csv');
    } catch (error) {
      console.error('Error fetching company data:', error);
      setError(`Failed to fetch company data: ${error.message}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Student-Company Matching</CardTitle>
              <div>
                <Button onClick={fetchMatchingData} disabled={isLoading} className="mr-2">
                  {isLoading ? 'Processing...' : 'Start Matching'}
                </Button>
                <Button onClick={handleDownloadCSV} disabled={isLoading || matchingData.length === 0}>
                  Download CSV
                </Button>
                <Button onClick={handleDownloadCompanyData} className="ml-2">
                  Download Company Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-center py-4">Processing matches... Please wait.</div>}
              {error && <div className="text-red-500 text-center py-4">{error}</div>}
              {!isLoading && !error && matchingData.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Company 1</TableHead>
                      <TableHead>Probability 1</TableHead>
                      <TableHead>Company 2</TableHead>
                      <TableHead>Probability 2</TableHead>
                      <TableHead>Company 3</TableHead>
                      <TableHead>Probability 3</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchingData.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.matches[0].company}</TableCell>
                        <TableCell>{`${(student.matches[0].probability * 100).toFixed(2)}%`}</TableCell>
                        <TableCell>{student.matches[1].company}</TableCell>
                        <TableCell>{`${(student.matches[1].probability * 100).toFixed(2)}%`}</TableCell>
                        <TableCell>{student.matches[2].company}</TableCell>
                        <TableCell>{`${(student.matches[2].probability * 100).toFixed(2)}%`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchingView;
