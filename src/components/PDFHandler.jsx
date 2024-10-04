import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { extractInformation } from '../utils/resumeParser';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = process.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

const PDFHandler = ({ onPDFsProcessed }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [pdfTexts, setPdfTexts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [parsedResumes, setParsedResumes] = useState([]);
  const [parsedCompanyDocs, setParsedCompanyDocs] = useState([]);

  useEffect(() => {
    console.log('Environment variables:', {
      CLIENT_ID,
      API_KEY
    });
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', initClient);
      };
      script.onerror = () => {
        console.error('Failed to load Google API script');
        toast.error('Failed to load Google API. Please check your internet connection and try again.');
      };
      document.body.appendChild(script);
    };

    loadGoogleAPI();

    return () => {
      // Clean up if needed
    };
  }, []);

  const initClient = () => {
    console.log('CLIENT_ID:', CLIENT_ID); // Add this line
    console.log('API_KEY:', API_KEY); // Add this line

    if (!CLIENT_ID || !API_KEY) {
      console.error('CLIENT_ID or API_KEY is missing');
      toast.error('Google API credentials are missing. Please check your environment variables.');
      return;
    }

    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      if (!window.gapi.auth2) {
        console.error('Auth2 instance is null');
        toast.error('Failed to initialize Google Auth. Please try refreshing the page.');
        return;
      }
      
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      setIsInitialized(true);
    }).catch((error) => {
      console.error('Error initializing Google API client', error);
      toast.error('Failed to initialize Google API client. Please check your credentials and try again.');
    });
  };

  const updateSigninStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
    console.log('Sign-in status updated:', isSignedIn);
  };

  const handleAuthClick = () => {
    if (!isInitialized) {
      toast.error('Google API is not yet initialized. Please wait and try again.');
      return;
    }

    const auth2 = window.gapi.auth2.getAuthInstance();
    if (!auth2) {
      console.error('Auth2 instance is null');
      toast.error('Google Auth is not properly initialized. Please try refreshing the page.');
      return;
    }

    if (!isSignedIn) {
      auth2.signIn().catch((error) => {
        console.error('Error signing in:', error);
        toast.error('Failed to sign in. Please try again.');
      });
    } else {
      auth2.signOut().catch((error) => {
        console.error('Error signing out:', error);
        toast.error('Failed to sign out. Please try again.');
      });
    }
  };

  const fetchPDFs = async () => {
    if (!isInitialized) {
      toast.error('Google API is not yet initialized. Please wait and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await window.gapi.client.drive.files.list({
        q: "mimeType='application/pdf'",
        fields: 'files(id, name, webContentLink)'
      });

      const files = response.result.files;
      if (files.length === 0) {
        toast.error('No PDFs found');
        setIsLoading(false);
        return;
      }

      const newPdfTexts = [];
      const newParsedResumes = [];
      const newParsedCompanyDocs = [];

      for (let file of files) {
        const text = await fetchAndExtractText(file);
        newPdfTexts.push(text);
        const parsedInfo = extractInformation(text);
        if (parsedInfo.isStudent) {
          newParsedResumes.push({ name: file.name, info: parsedInfo });
        } else {
          newParsedCompanyDocs.push({ name: file.name, info: parsedInfo });
        }
      }

      setPdfTexts(newPdfTexts);
      setParsedResumes(newParsedResumes);
      setParsedCompanyDocs(newParsedCompanyDocs);
      onPDFsProcessed(newParsedResumes, newParsedCompanyDocs, newPdfTexts);
      toast.success('PDFs processed and parsed successfully');
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      toast.error('Failed to fetch or parse PDFs. Please check your permissions and try again.');
    }
    setIsLoading(false);
  };

  const fetchAndExtractText = async (file) => {
    try {
      const extractedInfo = await extractInformation(file.webContentLink);
      return extractedInfo;
    } catch (error) {
      console.error('Error extracting information from PDF:', error);
      return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive PDF Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAuthClick} disabled={!isInitialized} className="mb-4">
          {isSignedIn ? 'Sign Out' : 'Sign In to Google Drive'}
        </Button>
        {isSignedIn && (
          <Button onClick={fetchPDFs} disabled={isLoading || !isInitialized}>
            {isLoading ? 'Processing...' : 'Fetch and Process PDFs'}
          </Button>
        )}
        {(parsedResumes.length > 0 || parsedCompanyDocs.length > 0) && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Processed Documents:</h3>
            <ul>
              {parsedResumes.map((resume, index) => (
                <li key={`student-${index}`}>{resume.name} (Student)</li>
              ))}
              {parsedCompanyDocs.map((doc, index) => (
                <li key={`company-${index}`}>{doc.name} (Company)</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default PDFHandler;