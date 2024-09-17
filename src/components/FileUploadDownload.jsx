import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FileUploadDownload = () => {
  const [studentCVs, setStudentCVs] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);

  const handleFileUpload = (event, setFile) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/zip') {
      setFile(file);
    } else {
      alert('Please upload a zip file');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (studentCVs && companyDetails) {
      // Here you would typically send the files to a server
      console.log('Files uploaded:', studentCVs, companyDetails);
      // For demo purposes, we'll just log the file names
      alert(`Uploaded files: ${studentCVs.name} and ${companyDetails.name}`);
    } else {
      alert('Please upload both zip files');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="studentCVs">Upload Student CVs (Zipped)</Label>
          <Input 
            id="studentCVs" 
            type="file" 
            accept=".zip" 
            onChange={(e) => handleFileUpload(e, setStudentCVs)} 
          />
        </div>
        <div>
          <Label htmlFor="companyDetails">Upload Company Details (Zipped)</Label>
          <Input 
            id="companyDetails" 
            type="file" 
            accept=".zip" 
            onChange={(e) => handleFileUpload(e, setCompanyDetails)} 
          />
        </div>
        <Button type="submit">Upload Files</Button>
      </form>
    </div>
  );
};

export default FileUploadDownload;
