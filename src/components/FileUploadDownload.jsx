import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extractCompanyInfo } from '../utils/pdfExtractor';

const FileUploadDownload = ({ onCompaniesExtracted }) => {
  const [companyFiles, setCompanyFiles] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/zip') {
      setCompanyFiles(file);
    } else {
      alert('Please upload a zip file');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (companyFiles) {
      try {
        const extractedCompanies = await extractCompanyInfo(companyFiles);
        onCompaniesExtracted(extractedCompanies);
        alert(`Successfully extracted information from ${extractedCompanies.length} company files.`);
      } catch (error) {
        console.error('Error extracting company information:', error);
        alert('An error occurred while processing the files. Please try again.');
      }
    } else {
      alert('Please upload a zip file containing company PDFs');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Company Files</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyFiles">Upload Company PDFs (Zipped)</Label>
            <Input 
              id="companyFiles" 
              type="file" 
              accept=".zip" 
              onChange={handleFileUpload} 
            />
          </div>
          <Button type="submit" className="w-full">Extract Company Information</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUploadDownload;
