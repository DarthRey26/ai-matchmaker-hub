import React, { useState, useEffect } from 'react';
import { extractInfo, convertToCSV } from '../utils/extractionUtils';

const ExtractedText = ({ extractedTexts, documentType }) => {
  const [extractedData, setExtractedData] = useState([]);

  useEffect(() => {
    if (extractedTexts && extractedTexts.length > 0) {
      const data = extractedTexts.map(text => extractInfo(text, documentType));
      setExtractedData(data);
    }
  }, [extractedTexts, documentType]);

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
    <div>
      <h2>Extracted Information</h2>
      {extractedData.length > 0 ? (
        <pre>{JSON.stringify(extractedData, null, 2)}</pre>
      ) : (
        <p>No data extracted. Please process some documents first.</p>
      )}
      <button onClick={handleDownloadCSV} disabled={extractedData.length === 0}>
        Download CSV
      </button>
    </div>
  );
};

export default ExtractedText;