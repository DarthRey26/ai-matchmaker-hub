import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Sidebar from '../components/Sidebar';

const Documents = () => {
  const companyDocuments = [
    { name: 'KC Partnership Details.pdf' },
    { name: 'Watson Farley & Williams Info.pdf' },
    { name: 'Mazars Company Profile.pdf' },
    { name: 'Forvia Overview.pdf' },
    { name: 'The Chosen One Agency Brief.pdf' },
  ];

  const studentCVs = [
    { name: 'Adarius_CV.pdf' },
    { name: 'Nicole_CV.pdf' },
    { name: 'Aidan_CV.pdf' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">IRIS Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Company Documents</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companyDocuments.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell>{doc.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Student CVs</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentCVs.map((cv, index) => (
                        <TableRow key={index}>
                          <TableCell>{cv.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documents;
