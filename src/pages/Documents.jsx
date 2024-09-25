import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';

const Documents = () => {
  const [studentDocuments, setStudentDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/documents')
      .then(response => response.json())
      .then(data => {
        setStudentDocuments(data.studentDocuments);
        setCompanyDocuments(data.companyDocuments);
      })
      .catch(error => console.error('Error fetching documents:', error));
  }, []);

  const renderDocumentTable = (documents, title, folder) => (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc, index) => (
              <TableRow key={index}>
                <TableCell>{doc}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => handleViewDocument(folder, doc)}>View Content</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const handleViewDocument = (folder, filename) => {
    window.open(`http://localhost:3001/view/${folder}/${filename}`, '_blank');
  };

  const handleFileUpload = (event, folder) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Refresh the document list
        fetch('http://localhost:3001/documents')
          .then(response => response.json())
          .then(data => {
            setStudentDocuments(data.studentDocuments);
            setCompanyDocuments(data.companyDocuments);
          });
      })
      .catch(error => console.error('Error uploading file:', error));
  };

  const handleDeleteDocument = (folder, filename) => {
    fetch(`http://localhost:3001/delete/${folder}/${filename}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        // Refresh the document list
        fetch('http://localhost:3001/documents')
          .then(response => response.json())
          .then(data => {
            setStudentDocuments(data.studentDocuments);
            setCompanyDocuments(data.companyDocuments);
          });
      })
      .catch(error => console.error('Error deleting file:', error));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <PDFHandler onPDFsProcessed={() => {}} />
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
            <div className="flex space-x-4">
              <div>
                <label htmlFor="studentUpload" className="btn btn-primary">Upload Student Document</label>
                <input id="studentUpload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'students')} />
              </div>
              <div>
                <label htmlFor="companyUpload" className="btn btn-primary">Upload Company Document</label>
                <input id="companyUpload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'companies')} />
              </div>
            </div>
          </div>
          {renderDocumentTable(studentDocuments, "Student Documents", "students")}
          {renderDocumentTable(companyDocuments, "Company Documents", "companies")}
        </div>
      </div>
    </div>
  );
};

export default Documents;
