import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FileUploadSection = ({ title, onFileSelect, onUpload, files, uploading, uploadProgress, error, success }) => {
  const fileInputRef = useRef(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={onFileSelect}
        />
        <Button onClick={() => fileInputRef.current.click()}>
          Select Files
        </Button>
        {files.length > 0 && (
          <p>{files.length} file(s) selected</p>
        )}
        <Button onClick={onUpload} disabled={uploading || files.length === 0}>
          {uploading ? 'Uploading...' : 'Upload and Process'}
        </Button>
        {uploading && (
          <Progress value={uploadProgress} className="w-full mt-2" />
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const BulkFileUpload = ({ onUploadSuccess }) => {
  const [studentFiles, setStudentFiles] = useState([]);
  const [companyFiles, setCompanyFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileSelect = (setFiles) => (event) => {
    const selectedFiles = Array.from(event.target.files).filter(file => 
      file.type === 'application/pdf' || file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async (files, type) => {
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('documents', file);
    });
    formData.append('type', type);

    try {
      const response = await axios.post(`http://localhost:3001/api/upload-documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { type: type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      console.log('Upload response:', response.data);
      setSuccess(`Successfully uploaded ${response.data.processedFiles} files`);
      if (type === 'student') {
        setStudentFiles([]);
      } else if (type === 'company') {
        setCompanyFiles([]);
      }
      onUploadSuccess(); // Call this function to refresh the document list
    } catch (error) {
      console.error('Error uploading files:', error);
      if (error.response) {
        setError(`Error uploading files: ${error.response.data.error}`);
      } else if (error.request) {
        setError('Error uploading files: No response received from server');
      } else {
        setError(`Error uploading files: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Tabs defaultValue="student">
      <TabsList>
        <TabsTrigger value="student">Student Documents</TabsTrigger>
        <TabsTrigger value="company">Company Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <FileUploadSection
          title="Bulk Student Document Upload"
          onFileSelect={handleFileSelect(setStudentFiles)}
          onUpload={() => handleUpload(studentFiles, 'student')}
          files={studentFiles}
          uploading={uploading}
          uploadProgress={uploadProgress}
          error={error}
          success={success}
        />
      </TabsContent>
      <TabsContent value="company">
        <FileUploadSection
          title="Bulk Company Document Upload"
          onFileSelect={handleFileSelect(setCompanyFiles)}
          onUpload={() => handleUpload(companyFiles, 'company')}
          files={companyFiles}
          uploading={uploading}
          uploadProgress={uploadProgress}
          error={error}
          success={success}
        />
      </TabsContent>
    </Tabs>
  );
};

export default BulkFileUpload;
