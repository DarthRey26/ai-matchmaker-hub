import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractCompanyDetails } from '../utils/pdfUtils';
import JSZip from 'jszip';

const FileUploadDownload = ({ onCompaniesExtracted }) => {
  const [companyZip, setCompanyZip] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/zip') {
      setCompanyZip(file);
    } else {
      alert('Please upload a zip file');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (companyZip) {
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(companyZip);
        const extractedCompanies = [];

        for (const [filename, file] of Object.entries(contents.files)) {
          if (filename.endsWith('.pdf')) {
            const pdfBlob = await file.async('blob');
            const companyDetails = await extractCompanyDetails(pdfBlob);
            extractedCompanies.push(companyDetails);
          }
        }

        onCompaniesExtracted(extractedCompanies);
        alert(`Successfully extracted details for ${extractedCompanies.length} companies.`);
      } catch (error) {
        console.error('Error processing zip file:', error);
        alert('Error processing the zip file. Please try again.');
      }
    } else {
      alert('Please upload a zip file with company PDFs');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Company Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyZip">Upload Company Details (Zipped PDFs)</Label>
            <Input 
              id="companyZip" 
              type="file" 
              accept=".zip" 
              onChange={handleFileUpload} 
            />
          </div>
          <Button type="submit" className="w-full">Upload and Process</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUploadDownload;
