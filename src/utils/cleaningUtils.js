export function cleanAndNormalize(info) {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(info)) {
    if (typeof value === 'string') {
      cleaned[key] = value.replace(/\s+/g, ' ').trim().toLowerCase();
    } else if (Array.isArray(value)) {
      cleaned[key] = value.map(item => 
        typeof item === 'string' ? item.replace(/\s+/g, ' ').trim().toLowerCase() : item
      );
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}