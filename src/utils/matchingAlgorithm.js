import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

export function matchStudentsToCompanies(students, companies) {
  if (!Array.isArray(students) || !Array.isArray(companies)) {
    console.error('Invalid input arrays');
    return [];
  }

  const tfidf = new TfIdf();

  // Process students
  const processedStudents = students
    .filter(student => student && typeof student === 'object')
    .map(student => {
      // Weight different sections differently
      const text = [
        (student?.education || '').repeat(2),  // Double weight for education
        student?.skills?.join(' ') || '',
        (student?.experience?.map(exp => exp.job_titles?.join(' ')).join(' ') || ''),
        student?.keywords?.join(' ') || ''
      ].join(' ').toLowerCase();
      
      const tokens = tokenizer.tokenize(text);
      tfidf.addDocument(tokens);
      
      return {
        name: student?.name?.replace(/^\d+-/, '') || 'Unknown Student', // Remove timestamp prefix
        docIndex: tfidf.documents.length - 1,
        tokens
      };
    });

  // Process companies
  const processedCompanies = companies
    .filter(company => company && typeof company === 'object')
    .map(company => {
      // Weight job descriptions and requirements more heavily
      const jobInfo = company?.job_descriptions ? 
        company.job_descriptions.join(' ').repeat(3) : ''; // Triple weight for job descriptions
      
      const text = [
        company?.company_name || '',
        (company?.company_description || '').repeat(2), // Double weight for company description
        jobInfo,
        company?.number_of_students?.map(s => s.position).join(' ') || ''
      ].join(' ').toLowerCase();
      
      const tokens = tokenizer.tokenize(text);
      tfidf.addDocument(tokens);
      
      return {
        name: company?.company_name || 'Unknown Company',
        docIndex: tfidf.documents.length - 1,
        tokens
      };
    });

  // Calculate matches with normalized probabilities
  return processedStudents.map(student => {
    const matches = processedCompanies
      .map(company => {
        let similarity = 0;
        const allTerms = new Set([...student.tokens, ...company.tokens]);
        
        allTerms.forEach(term => {
          const studentScore = tfidf.tfidf(term, student.docIndex) || 0;
          const companyScore = tfidf.tfidf(term, company.docIndex) || 0;
          similarity += studentScore * companyScore;
        });

        return {
          company: company.name,
          probability: similarity
        };
      })
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);

    // Normalize probabilities to percentages
    const maxProb = Math.max(...matches.map(m => m.probability));
    matches.forEach(match => {
      match.probability = match.probability > 0 ? 
        (match.probability / maxProb) * 100 : 0.01;
    });

    return {
      name: student.name,
      matches
    };
  });
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * (vec2[i] || 0), 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2) || 0;
}
