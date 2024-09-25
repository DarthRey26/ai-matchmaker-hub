import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';

const Documents = () => {
  const [studentDocuments, setStudentDocuments] = useState([]);
  const [companyDocuments, setCompanyDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:3001/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setStudentDocuments(data.studentDocuments);
      setCompanyDocuments(data.companyDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents. Please try again.');
    }
  };

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
                  <Button variant="outline" onClick={() => handleViewDocument(folder, doc)}>View</Button>
                  <Button variant="outline" className="ml-2" onClick={() => handleDeleteDocument(folder, doc)}>Delete</Button>
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

  const handleFileUpload = async (event, folder) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log(data.message);
      toast.success('File uploaded successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (folder, filename) => {
    try {
      const response = await fetch(`http://localhost:3001/delete/${folder}/${filename}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      const data = await response.json();
      console.log(data.message);
      toast.success('File deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file. Please try again.');
    }
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
                <input
                  id="studentUpload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'students')}
                  disabled={isUploading}
                />
                <label
                  htmlFor="studentUpload"
                  className={`btn btn-primary ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Student Document'}
                </label>
              </div>
              <div>
                <input
                  id="companyUpload"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'companies')}
                  disabled={isUploading}
                />
                <label
                  htmlFor="companyUpload"
                  className={`btn btn-primary ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Company Document'}
                </label>
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
