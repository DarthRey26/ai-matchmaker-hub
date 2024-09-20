import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import * as pdfjs from 'pdfjs-dist';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

const PDFHandler = ({ onPDFsProcessed }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [pdfTexts, setPdfTexts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadGoogleAPI = () => {
      gapi.load('client:auth2', initClient);
    };

    loadGoogleAPI();
  }, []);

  const initClient = () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error) => {
      console.error('Error initializing Google API client', error);
      toast.error('Failed to initialize Google API client');
    });
  };

  const updateSigninStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
  };

  const handleAuthClick = () => {
    if (!isSignedIn) {
      gapi.auth2.getAuthInstance().signIn();
    } else {
      gapi.auth2.getAuthInstance().signOut();
    }
  };

  const fetchPDFs = async () => {
    setIsLoading(true);
    try {
      const response = await gapi.client.drive.files.list({
        q: "mimeType='application/pdf' and name contains 'IRIS'",
        fields: 'files(id, name, webContentLink)'
      });

      const files = response.result.files;
      if (files.length === 0) {
        toast.error('No PDFs found in the IRIS folder');
        setIsLoading(false);
        return;
      }

      for (let file of files) {
        const text = await fetchAndExtractText(file);
        setPdfTexts(prev => ({ ...prev, [file.name]: text }));
      }

      onPDFsProcessed(pdfTexts);
      toast.success('PDFs processed successfully');
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      toast.error('Failed to fetch PDFs from Google Drive');
    }
    setIsLoading(false);
  };

  const fetchAndExtractText = async (file) => {
    const response = await fetch(file.webContentLink);
    const arrayBuffer = await response.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive PDF Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAuthClick} className="mb-4">
          {isSignedIn ? 'Sign Out' : 'Sign In to Google Drive'}
        </Button>
        {isSignedIn && (
          <Button onClick={fetchPDFs} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Fetch and Process PDFs'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFHandler;