import React, { useState, useEffect } from "react";
import { extractInfo, convertToCSV } from "../utils/extractionUtils";
import { parseResumeFromPdf } from "../utils/resumeParserUtils";

const ExtractedText = ({ extractedTexts, documentType }) => {
  const [extractedData, setExtractedData] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const [textItems, setTextItems] = useState([]);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (extractedTexts && extractedTexts.length > 0) {
      const data = extractedTexts.map(text => extractInfo(text, documentType));
      setExtractedData(data);
    }
  }, [extractedTexts, documentType]);

  useEffect(() => {
    async function processPdf() {
      if (fileUrl) {
        const extractedResume = await parseResumeFromPdf(fileUrl);
        setResume(extractedResume);
      }
    }
    processPdf();
  }, [fileUrl]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  const handleDownloadCSV = () => {
    if (extractedData.length === 0) {
      alert('No data to download');
      return;
    }
    const csvContent = convertToCSV(extractedData, documentType);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${documentType}_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Extracted Information</h2>
      <div className="mb-4">
        <input type="file" accept=".pdf" onChange={handleFileUpload} className="mb-2" />
        {fileUrl && (
          <div className="aspect-h-[9.5] aspect-w-7 mb-4">
            <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full border" />
          </div>
        )}
      </div>
      {resume && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Resume Parsing Results</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {Object.entries(resume).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
      {extractedData.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Previously Extracted Data</h3>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      ) : (
        <p>No previously extracted data available.</p>
      )}
      <button 
        onClick={handleDownloadCSV} 
        disabled={extractedData.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        Download CSV
      </button>
    </div>
  );
};

export default ExtractedText;