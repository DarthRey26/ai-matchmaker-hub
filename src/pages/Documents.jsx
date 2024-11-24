import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';
import BulkFileUpload from '../components/BulkFileUpload';

const Documents = () => {
  const [studentDocuments, setStudentDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [parsedResumes, setParsedResumes] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    fetch('http://localhost:3001/documents')
      .then(response => response.json())
      .then(data => {
        console.log('Received documents:', data);
        setStudentDocuments(data.students || []);
        setCompanyDocuments(data.companies || []);
      })
      .catch(error => {
        console.error('Error fetching documents:', error);
        setStudentDocuments([]);
        setCompanyDocuments([]);
      });
  };

  const handleViewDocument = (folder, filename) => {
    window.open(`http://localhost:3001/uploads/${folder}/${filename}`, '_blank');
  };

  const handleDeleteDocument = (folder, filename) => {
    fetch(`http://localhost:3001/delete/${folder}/${filename}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        fetchDocuments();
      })
      .catch(error => console.error('Error deleting file:', error));
  };

  const handlePDFsProcessed = (processedResumes) => {
    setParsedResumes(processedResumes);
  };

  const renderDocumentTable = (documents, title, folder) => (
    <Card className="mt-4">
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
            {documents && documents.length > 0 ? (
              documents.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc.formatted || doc.original}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => handleViewDocument(folder, doc.original)} className="mr-2">View</Button>
                    <Button variant="destructive" onClick={() => handleDeleteDocument(folder, doc.original)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No documents found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderParsedResumes = () => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Parsed Resumes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Education</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedResumes.map((resume, index) => (
              <TableRow key={index}>
                <TableCell>{resume.name}</TableCell>
                <TableCell>{resume.info.skills.join(', ')}</TableCell>
                <TableCell>{resume.info.experience.map(exp => exp.title).join(', ')}</TableCell>
                <TableCell>{resume.info.education.map(edu => edu.degree).join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <PDFHandler onPDFsProcessed={handlePDFsProcessed} />
          <BulkFileUpload onUploadSuccess={fetchDocuments} />
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Edit Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {renderDocumentTable(studentDocuments, "Student Documents", "student")}
              {renderDocumentTable(companyDocuments, "Company Documents", "company")}
              {parsedResumes.length > 0 && renderParsedResumes()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documents;