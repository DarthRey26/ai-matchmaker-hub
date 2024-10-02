export const generateCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).filter(key => key !== 'filename');
  const rows = data.map(item => 
    headers.map(header => {
      if (Array.isArray(item[header])) {
        return item[header].join(';');
      } else if (typeof item[header] === 'object' && item[header] !== null) {
        return JSON.stringify(item[header]);
      }
      return item[header];
    })
  );
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};