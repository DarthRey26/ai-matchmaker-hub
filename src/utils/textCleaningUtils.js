import natural from 'natural';

export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, ' ')
    .trim();
};

export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

export const removeExtraInformation = (text) => {
  if (!text) return '';
  // Remove common extra phrases and metadata
  return text
    .replace(/\(optional\)/gi, '')
    .replace(/\(required\)/gi, '')
    .replace(/\(if applicable\)/gi, '')
    .replace(/please provide/gi, '')
    .replace(/please specify/gi, '')
    .trim();
};

export const extractListItems = (text) => {
  if (!text) return [];
  // Handle different list formats
  const items = text.split(/(?:\r?\n|\r|•|-|\d+\.)+/)
    .map(item => cleanText(item))
    .filter(item => item.length > 0);
  return [...new Set(items)]; // Remove duplicates
};

export const standardizeCompanyName = (filename, content) => {
  // Extract company name from filename first
  let companyName = filename
    .split('-')
    .pop()
    .split('.')[0]
    .replace(/_/g, ' ')
    .trim();

  // Common company name patterns in content
  const patterns = [
    /company\s*name\s*:?\s*([^:\n]+)/i,
    /^([^:\n]+?)\s*(?:company profile|job description|about us)/i,
    /([^:\n]+?)\s*(?:is seeking|is looking for|we are)/i
  ];

  // Try to find company name in content
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const extracted = cleanText(match[1]);
      if (extracted.length > 3) {
        companyName = extracted;
        break;
      }
    }
  }

  return normalizeText(companyName);
};

export const extractRole = (filename, content) => {
  // Try to extract role from filename first
  const filenameParts = filename.split('-');
  let role = filenameParts.length > 1 ? 
    filenameParts.slice(1).join(' ').split('.')[0].replace(/_/g, ' ') : '';

  // Common role patterns in content
  const patterns = [
    /position\s*:?\s*([^:\n]+)/i,
    /job\s*title\s*:?\s*([^:\n]+)/i,
    /role\s*:?\s*([^:\n]+)/i,
    /hiring\s*for\s*:?\s*([^:\n]+)/i
  ];

  // Try to find role in content
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const extracted = cleanText(match[1]);
      if (extracted.length > 3) {
        role = extracted;
        break;
      }
    }
  }

  return normalizeText(role);
};