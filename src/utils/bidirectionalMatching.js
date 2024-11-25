import natural from 'natural';
import { tokenizer } from './advancedExtraction.js';

export class BidirectionalMatcher {
  constructor(students, companies) {
    this.students = students;
    this.companies = companies;
    this.tfidf = new natural.TfIdf();
    this.initializeTfIdf();
  }

  initializeTfIdf() {
    // Add student documents
    this.students.forEach(student => {
      const studentDoc = [
        ...(student.skills || []),
        ...(student.experience?.map(exp => exp.job_titles?.join(' ')) || []),
        student.name
      ].join(' ');
      this.tfidf.addDocument(studentDoc);
    });

    // Add company documents
    this.companies.forEach(company => {
      const companyDoc = [
        company.company_name,
        company.company_description,
        ...(company.job_descriptions?.map(job => job.description) || []),
        ...(company.required_skills || [])
      ].join(' ');
      this.tfidf.addDocument(companyDoc);
    });
  }

  calculateTfIdfSimilarity(studentIdx, companyIdx) {
    let similarity = 0;
    const terms = new Set([
      ...this.tfidf.documents[studentIdx].keys(),
      ...this.tfidf.documents[companyIdx].keys()
    ]);

    terms.forEach(term => {
      const studentScore = this.tfidf.tfidf(term, studentIdx);
      const companyScore = this.tfidf.tfidf(term, companyIdx);
      similarity += studentScore * companyScore;
    });

    return similarity;
  }

  calculateSkillMatch(studentSkills, companySkills) {
    if (!studentSkills?.length || !companySkills?.length) return 0.15;
    
    const normalizedStudentSkills = studentSkills.map(skill => skill.toLowerCase().trim());
    const normalizedCompanySkills = companySkills.map(skill => skill.toLowerCase().trim());
    
    let matchCount = 0;
    normalizedStudentSkills.forEach(studentSkill => {
      if (normalizedCompanySkills.some(companySkill => 
        companySkill.includes(studentSkill) || studentSkill.includes(companySkill)
      )) {
        matchCount++;
      }
    });

    return Math.max(matchCount / Math.max(normalizedStudentSkills.length, normalizedCompanySkills.length), 0.15);
  }

  generateMatchingMetrics() {
    const results = [];
    const maxSlotsPerCompany = 2;
    const companyAssignments = new Map();

    this.students.forEach((student, studentIdx) => {
      const matches = this.companies.map((company, companyIdx) => {
        const tfidfScore = this.calculateTfIdfSimilarity(studentIdx, companyIdx);
        const skillMatch = this.calculateSkillMatch(student.skills, company.required_skills);
        
        // Weighted scoring
        const score = (tfidfScore * 0.6 + skillMatch * 0.4);
        
        return {
          company: company.company_name,
          bidirectionalScore: Math.min(score, 0.95),
          details: {
            student: {
              skillMatch: skillMatch * 100,
              tfidfScore: tfidfScore * 100
            }
          }
        };
      });

      // Sort matches by score and filter based on available slots
      const availableMatches = matches
        .sort((a, b) => b.bidirectionalScore - a.bidirectionalScore)
        .filter(match => {
          const currentAssignments = companyAssignments.get(match.company) || 0;
          return currentAssignments < maxSlotsPerCompany;
        })
        .slice(0, 2);

      // Update company assignments
      availableMatches.forEach(match => {
        const current = companyAssignments.get(match.company) || 0;
        companyAssignments.set(match.company, current + 1);
      });

      results.push({
        student: student.name,
        matches: availableMatches
      });
    });

    return results;
  }
}