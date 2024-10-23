import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

export function matchStudentsToCompanies(students, companies) {
  const cleanText = (text) => {
    if (typeof text === 'string') {
      return text.replace(/[^a-zA-Z\s]/g, '').toLowerCase().trim();
    }
    return '';
  };

  const tfidf = new TfIdf();

  students.forEach(student => {
    const studentProfile = `${student.education} ${student.experience} ${student.skills}`.toLowerCase();
    tfidf.addDocument(tokenizer.tokenize(studentProfile));
  });

  companies.forEach(company => {
    const companyProfile = `${company.job_description} ${company.company_name}`.toLowerCase();
    tfidf.addDocument(tokenizer.tokenize(companyProfile));
  });

  return students.map(student => {
    const studentVector = tfidf.tfidf(tokenizer.tokenize(`${student.education} ${student.experience} ${student.skills}`.toLowerCase()), 0);
    const matches = companies.map(company => {
      const companyVector = tfidf.tfidf(tokenizer.tokenize(`${company.job_description} ${company.company_name}`.toLowerCase()), 0);
      const similarity = cosineSimilarity(studentVector, companyVector);
      return {
        company: company.company_name,
        probability: parseFloat((similarity * 0.5 + 0.5).toFixed(2))
      };
    });

    return {
      name: student.name,
      matches: matches.sort((a, b) => b.probability - a.probability).slice(0, 3)
    };
  });
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * (vec2[i] || 0), 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2) || 0;
}
