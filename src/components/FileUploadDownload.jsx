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

  const handleDownload = () => {
    // This is a placeholder function. In a real application,
    // you would generate or fetch the CSV data here.
    const csvContent = "data:text/csv;charset=utf-8,Name,Age\nJohn,30\nJane,25";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div>
        <Button onClick={handleDownload}>Download CSV</Button>
      </div>
    </div>
  );
};

export default FileUploadDownload;