import natural from 'natural';
import { tokenizer } from './advancedExtraction.js';
import { formatStudentName } from './companyExtraction.js';

export class BidirectionalMatcher {
  constructor(students, companies) {
    this.students = students;
    this.companies = companies;
    this.tfidf = new natural.TfIdf();
    this.initializeTfIdf();
  }

  initializeTfIdf() {
    // Add student documents with weighted features
    this.students.forEach(student => {
      const studentDoc = [
        ...(Array.isArray(student.skills) ? student.skills.map(skill => skill.repeat(3)) : []),
        ...(Array.isArray(student.experience) ? student.experience.flatMap(exp => Array.isArray(exp.job_titles) ? exp.job_titles.map(title => title.repeat(2)) : []) : []),
        student.name,
        ...(Array.isArray(student.keywords) ? student.keywords : [])
      ].join(' ').toLowerCase();
      this.tfidf.addDocument(studentDoc);
    });

    // Add company documents with weighted features
    this.companies.forEach(company => {
      const companyDoc = [
        company.company_name ? company.company_name.repeat(3) : '',
        company.role ? company.role.repeat(2) : '',
        ...(Array.isArray(company.requirements) ? company.requirements : []),
        ...(Array.isArray(company.job_descriptions) ? company.job_descriptions : [])
      ].join(' ').toLowerCase();
      this.tfidf.addDocument(companyDoc);
    });
  }

  calculateTfIdfSimilarity(studentIdx, companyIdx) {
    const terms = new Set();
    
    // Get all terms from both documents
    const studentTerms = Object.keys(this.tfidf.documents[studentIdx]);
    const companyTerms = Object.keys(this.tfidf.documents[companyIdx]);
    
    studentTerms.forEach(term => terms.add(term));
    companyTerms.forEach(term => terms.add(term));

    let similarity = 0;
    let normStudent = 0;
    let normCompany = 0;

    // Calculate cosine similarity
    terms.forEach(term => {
      const studentScore = this.tfidf.tfidf(term, studentIdx);
      const companyScore = this.tfidf.tfidf(term, companyIdx);
      
      similarity += studentScore * companyScore;
      normStudent += studentScore * studentScore;
      normCompany += companyScore * companyScore;
    });

    // Normalize the similarity score
    const normalizedSimilarity = similarity / (Math.sqrt(normStudent) * Math.sqrt(normCompany));
    return Math.min(normalizedSimilarity, 0.95); // Cap at 0.95 to allow for uncertainty
  }

  calculateSkillMatch(studentSkills = [], companyRequirements = []) {
    if (!studentSkills.length || !companyRequirements.length) return 0.15;
    
    const normalizedStudentSkills = studentSkills.map(skill => skill.toLowerCase());
    const normalizedCompanySkills = companyRequirements.map(skill => skill.toLowerCase());
    
    let totalScore = 0;
    let matches = 0;

    normalizedStudentSkills.forEach(studentSkill => {
      const bestMatch = normalizedCompanySkills.reduce((best, companySkill) => {
        const distance = natural.JaroWinklerDistance(studentSkill, companySkill);
        return distance > best ? distance : best;
      }, 0);

      if (bestMatch > 0.8) { // High confidence match
        totalScore += bestMatch;
        matches++;
      }
    });

    // Calculate weighted score based on matches and similarity
    const coverage = matches / Math.max(normalizedStudentSkills.length, normalizedCompanySkills.length);
    const averageScore = matches > 0 ? totalScore / matches : 0;
    
    return Math.max((coverage * 0.6 + averageScore * 0.4), 0.15); // Ensure minimum score of 0.15
  }

  calculateExperienceMatch(studentExp, companyReqs) {
    if (!studentExp?.length || !companyReqs?.length) return 0.2;

    const studentExpText = studentExp
      .flatMap(exp => exp.job_titles || [])
      .join(' ')
      .toLowerCase();

    const companyReqsText = companyReqs.join(' ').toLowerCase();
    
    // Use TF-IDF for experience matching
    const tempTfidf = new natural.TfIdf();
    tempTfidf.addDocument(studentExpText);
    tempTfidf.addDocument(companyReqsText);

    const terms = new Set([
      ...tokenizer.tokenize(studentExpText),
      ...tokenizer.tokenize(companyReqsText)
    ]);

    let similarity = 0;
    terms.forEach(term => {
      similarity += tempTfidf.tfidf(term, 0) * tempTfidf.tfidf(term, 1);
    });

    return Math.min(similarity, 0.9); // Cap at 0.9 to allow for uncertainty
  }

  generateMatchingMetrics() {
    return this.students.map((student, studentIdx) => {
      const matches = this.companies.map((company, companyIdx) => {
        const tfidfScore = this.calculateTfIdfSimilarity(studentIdx, companyIdx);
        const skillMatch = this.calculateSkillMatch(student.skills, company.requirements);
        const experienceMatch = this.calculateExperienceMatch(student.experience, company.requirements);

        const randomFactor = 0.95 + (Math.random() * 0.1);
        const score = (
          (tfidfScore * 0.4) + 
          (skillMatch * 0.3) + 
          (experienceMatch * 0.3)
        ) * randomFactor;

        return {
          pdfName: company.pdfName || 'Unknown Document',
          company_name: company.company_name || 'Company Not Found',
          role: company.role || 'Role Not Specified',
          bidirectionalScore: score,
          details: {
            student: {
              skillMatch: skillMatch * 100,
              experienceMatch: experienceMatch * 100
            }
          },
          filePath: company.filePath
        };
      });

      const formattedStudentName = formatStudentName(student.name);

      return {
        student: formattedStudentName,
        matches: matches.sort((a, b) => b.bidirectionalScore - a.bidirectionalScore)
      };
    });
  }
}