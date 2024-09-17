import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FileUploadDownload = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

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
    if (file1 && file2) {
      // Here you would typically send the files to a server
      console.log('Files uploaded:', file1, file2);
      // For demo purposes, we'll just log the file names
      alert(`Uploaded files: ${file1.name} and ${file2.name}`);
    } else {
      alert('Please upload both zip files');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file1">Upload Zip File 1</Label>
          <Input 
            id="file1" 
            type="file" 
            accept=".zip" 
            onChange={(e) => handleFileUpload(e, setFile1)} 
          />
        </div>
        <div>
          <Label htmlFor="file2">Upload Zip File 2</Label>
          <Input 
            id="file2" 
            type="file" 
            accept=".zip" 
            onChange={(e) => handleFileUpload(e, setFile2)} 
          />
        </div>
        <Button type="submit">Upload Files</Button>
      </form>
    </div>
  );
};

export default FileUploadDownload;
