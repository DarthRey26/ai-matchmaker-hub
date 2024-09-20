import React, { useState, useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

const PDFHandler = ({ onPDFsProcessed }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [pdfTexts, setPdfTexts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        setIsGapiLoaded(true);
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
      const script = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initClient = () => {
    if (!window.gapi) {
      console.error('Google API not loaded');
      toast.error('Google API not loaded. Please refresh the page and try again.');
      return;
    }

    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      if (!window.gapi.auth2.getAuthInstance()) {
        console.error('Auth instance not initialized');
        toast.error('Failed to initialize Google authentication. Please check your credentials and try again.');
        return;
      }
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error) => {
      console.error('Error initializing Google API client', error);
      toast.error('Failed to initialize Google API client. Please check your credentials and try again.');
    });
  };

  const updateSigninStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
  };

  const handleAuthClick = () => {
    if (!window.gapi || !window.gapi.auth2) {
      console.error('Google API not fully loaded');
      toast.error('Google API not fully loaded. Please refresh the page and try again.');
      return;
    }

    if (!isSignedIn) {
      window.gapi.auth2.getAuthInstance().signIn().catch((error) => {
        console.error('Error signing in:', error);
        toast.error('Failed to sign in. Please try again.');
      });
    } else {
      window.gapi.auth2.getAuthInstance().signOut().catch((error) => {
        console.error('Error signing out:', error);
        toast.error('Failed to sign out. Please try again.');
      });
    }
  };

  const fetchPDFs = async () => {
    if (!window.gapi || !window.gapi.client) {
      console.error('Google API client not loaded');
      toast.error('Google API client not loaded. Please refresh the page and try again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await window.gapi.client.drive.files.list({
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
      toast.error('Failed to fetch PDFs from Google Drive. Please check your permissions and try again.');
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
        <Button 
          onClick={handleAuthClick} 
          className="mb-4"
          disabled={!isGapiLoaded}
        >
          {isSignedIn ? 'Sign Out' : 'Sign In to Google Drive'}
        </Button>
        {isSignedIn && (
          <Button onClick={fetchPDFs} disabled={isLoading || !isGapiLoaded}>
            {isLoading ? 'Processing...' : 'Fetch and Process PDFs'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFHandler;
