import natural from 'natural';
import path from 'path';
import { tokenizer } from './advancedExtraction.js';

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
        ...(Array.isArray(student.experience) ? student.experience.flatMap(exp => 
          Array.isArray(exp.job_titles) ? exp.job_titles.map(title => title.repeat(2)) : []
        ) : []),
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
        ...(Array.isArray(company.job_descriptions) ? 
          company.job_descriptions.map(job => job.description ? job.description.repeat(2) : '') : 
          []
        ),
        ...(Array.isArray(company.requirements) ? company.requirements : []),
      ].join(' ').toLowerCase();
      this.tfidf.addDocument(companyDoc);
    });
  }

  calculateTfIdfSimilarity(studentIdx, companyIdx) {
    const terms = new Set();
    const studentDoc = this.tfidf.documents[studentIdx];
    const companyDoc = this.tfidf.documents[companyIdx];
    
    Object.keys(studentDoc || {}).forEach(term => terms.add(term));
    Object.keys(companyDoc || {}).forEach(term => terms.add(term));

    let similarity = 0;
    let normStudent = 0;
    let normCompany = 0;

    terms.forEach(term => {
      const studentScore = this.tfidf.tfidf(term, studentIdx);
      const companyScore = this.tfidf.tfidf(term, companyIdx);
      
      similarity += studentScore * companyScore;
      normStudent += studentScore * studentScore;
      normCompany += companyScore * companyScore;
    });

    const normalizedSimilarity = similarity / (Math.sqrt(normStudent) * Math.sqrt(normCompany));
    return Math.min(normalizedSimilarity || 0, 0.95);
  }

  findMatchedSkills(studentSkills = [], companyRequirements = []) {
    if (!studentSkills.length || !companyRequirements.length) return [];
    
    const normalizedStudentSkills = studentSkills.map(skill => skill.toLowerCase());
    const normalizedCompanySkills = companyRequirements.map(skill => skill.toLowerCase());
    
    return normalizedStudentSkills.filter(studentSkill => 
      normalizedCompanySkills.some(companySkill => 
        natural.JaroWinklerDistance(studentSkill, companySkill) > 0.8
      )
    );
  }

  calculateSkillMatch(studentSkills = [], companyRequirements = []) {
    const matchedSkills = this.findMatchedSkills(studentSkills, companyRequirements);
    if (!studentSkills.length || !companyRequirements.length) return 0.15;
    
    const coverage = matchedSkills.length / Math.max(studentSkills.length, companyRequirements.length);
    return Math.max((coverage * 0.8 + Math.random() * 0.2), 0.15);
  }

  calculateExperienceMatch(studentExp, companyReqs) {
    if (!studentExp?.length || !companyReqs?.length) return 0.2;

    const studentExpText = studentExp
      .flatMap(exp => exp.job_titles || [])
      .join(' ')
      .toLowerCase();

    const companyReqsText = companyReqs.join(' ').toLowerCase();
    
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

    return Math.min(Math.max(similarity + (Math.random() * 0.1), 0.2), 0.9);
  }

  generateMatchingMetrics() {
    const results = [];
    const maxSlotsPerCompany = 2;
    const companyAssignments = new Map();

    this.students.forEach((student, studentIdx) => {
      const matches = this.companies.map((company, companyIdx) => {
        const tfidfScore = this.calculateTfIdfSimilarity(studentIdx, companyIdx);
        const skillMatch = this.calculateSkillMatch(student.skills, company.requirements);
        const experienceMatch = this.calculateExperienceMatch(student.experience, company.requirements);
        
        const randomFactor = 0.95 + (Math.random() * 0.1);
        const score = (
          (tfidfScore * 0.4) + 
          (skillMatch * 0.35) + 
          (experienceMatch * 0.25)
        ) * randomFactor;
        
        return {
          company: company.company_name || path.basename(company.filename, '.pdf').split('_')[0],
          role: company.role,
          bidirectionalScore: Math.min(score, 0.95),
          matchedSkills: this.findMatchedSkills(student.skills, company.requirements),
          details: {
            student: {
              skillMatch: skillMatch * 100,
              experienceMatch: experienceMatch * 100,
              tfidfScore: tfidfScore * 100
            }
          }
        };
      });

      const availableMatches = matches
        .sort((a, b) => b.bidirectionalScore - a.bidirectionalScore)
        .filter(match => {
          const currentAssignments = companyAssignments.get(match.company) || 0;
          return currentAssignments < maxSlotsPerCompany;
        })
        .slice(0, 2);

      availableMatches.forEach(match => {
        const current = companyAssignments.get(match.company) || 0;
        companyAssignments.set(match.company, current + 1);
      });

      results.push({
        student: student.name || 'Unknown Student',
        matches: availableMatches.map(match => ({
          companyName: match.company,
          role: match.role,
          probability: match.bidirectionalScore * 100,
          matchedSkills: match.matchedSkills,
          status: 'Not Yet',
          qualityMetrics: {
            skillFit: match.details.student.skillMatch,
            experienceFit: match.details.student.experienceMatch,
            overallQuality: match.bidirectionalScore * 100
          }
        }))
      });
    });

    return results;
  }
}
