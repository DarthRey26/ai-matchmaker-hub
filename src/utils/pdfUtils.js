import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const extractCompanyDetails = async (pdfFile) => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');

    // Extract company name (assuming it's the first line)
    const companyName = text.split('\n')[0].trim();

    // Extract brief description (assuming it's the second paragraph)
    const briefDescription = text.split('\n\n')[1]?.trim() || 'No description available.';

    // Extract job description (assuming it starts after "Job Description:")
    const jobDescriptionStart = text.indexOf('Job Description:');
    const jobDescription = jobDescriptionStart !== -1
      ? text.slice(jobDescriptionStart + 'Job Description:'.length).trim()
      : 'No job description available.';

    return { companyName, briefDescription, jobDescription };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return { 
      companyName: 'Unknown Company', 
      briefDescription: 'Error parsing PDF', 
      jobDescription: 'Error parsing PDF' 
    };
  }
};