import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Sidebar from '../components/Sidebar';
import PDFHandler from '../components/PDFHandler';

const Documents = () => {
  const [pdfTexts, setPdfTexts] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handlePDFsProcessed = (texts) => {
    setPdfTexts(texts);
  };

  const handleDocumentClick = (docName) => {
    setSelectedDocument({ name: docName, content: pdfTexts[docName] });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8">
          <PDFHandler onPDFsProcessed={handlePDFsProcessed} />
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">IRIS Documents</CardTitle>
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
                  {Object.keys(pdfTexts).map((docName, index) => (
                    <TableRow key={index}>
                      <TableCell>{docName}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => handleDocumentClick(docName)}>View Content</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{docName}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <p>{pdfTexts[docName]}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documents;
