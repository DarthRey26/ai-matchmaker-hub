import natural from 'natural';
import { tokenizer } from './advancedExtraction.js';

export class BidirectionalMatcher {
  constructor(students, companies) {
    this.students = students;
    this.companies = companies;
    this.tfidf = new natural.TfIdf();
    this.matchScores = new Map();
    this.companyAssignments = new Map();
    this.skillsWeightMap = this.buildSkillsWeightMap();
  }

  buildSkillsWeightMap() {
    const weightMap = new Map();
    // Technical skills have higher weight
    ['programming', 'software', 'development', 'analysis', 'engineering'].forEach(skill => 
      weightMap.set(skill, 1.5)
    );
    // Business skills
    ['marketing', 'management', 'business', 'sales'].forEach(skill => 
      weightMap.set(skill, 1.3)
    );
    // Soft skills
    ['communication', 'leadership', 'teamwork'].forEach(skill => 
      weightMap.set(skill, 1.2)
    );
    return weightMap;
  }

  calculateExperienceMatch(sourceExp, targetExp) {
    if (!sourceExp?.length || !targetExp?.length) return 0.15;
    
    const weights = {
      jobTitle: 0.4,
      description: 0.3,
      duration: 0.2,
      recency: 0.1
    };

    let totalScore = 0;
    let maxScore = 0;

    sourceExp.forEach(sExp => {
      const sourceYear = new Date(sExp.end_date || Date.now()).getFullYear();
      
      targetExp.forEach(tExp => {
        let score = 0;
        maxScore += 1;

        // Job title similarity
        const titleSimilarity = this.calculateTextSimilarity(
          sExp.job_titles?.join(' ') || '',
          tExp.job_titles?.join(' ') || ''
        );
        score += titleSimilarity * weights.jobTitle;

        // Description similarity
        const descSimilarity = this.calculateTextSimilarity(
          sExp.description || '',
          tExp.description || ''
        );
        score += descSimilarity * weights.description;

        // Duration bonus (longer experience gets higher weight)
        const durationBonus = Math.min(sExp.duration_months / 12, 1) * weights.duration;
        score += durationBonus;

        // Recency bonus (more recent experience gets higher weight)
        const yearsAgo = new Date().getFullYear() - sourceYear;
        const recencyBonus = Math.max(1 - (yearsAgo / 5), 0) * weights.recency;
        score += recencyBonus;

        totalScore += score;
      });
    });

    return Math.max(totalScore / maxScore, 0.15);
  }

  calculateSkillMatch(studentSkills, companySkills) {
    if (!studentSkills?.length || !companySkills?.length) return 0.15;
    
    const normalizedStudentSkills = studentSkills.map(skill => skill.toLowerCase().trim());
    const normalizedCompanySkills = companySkills.map(skill => skill.toLowerCase().trim());
    
    let totalScore = 0;
    let maxPossibleScore = 0;

    normalizedStudentSkills.forEach(studentSkill => {
      let bestMatchScore = 0;
      let skillWeight = 1.0;

      // Find skill weight
      this.skillsWeightMap.forEach((weight, keyword) => {
        if (studentSkill.includes(keyword)) {
          skillWeight = weight;
        }
      });

      normalizedCompanySkills.forEach(companySkill => {
        let matchScore = 0;
        // Exact match
        if (studentSkill === companySkill) {
          matchScore = 1.0;
        }
        // Partial match
        else if (studentSkill.includes(companySkill) || companySkill.includes(studentSkill)) {
          matchScore = 0.7;
        }
        // Word-level match
        else {
          const studentWords = studentSkill.split(/[\s,]+/);
          const companyWords = companySkill.split(/[\s,]+/);
          const commonWords = studentWords.filter(word => companyWords.includes(word));
          if (commonWords.length > 0) {
            matchScore = 0.5 * (commonWords.length / Math.max(studentWords.length, companyWords.length));
          }
        }
        bestMatchScore = Math.max(bestMatchScore, matchScore);
      });

      totalScore += bestMatchScore * skillWeight;
      maxPossibleScore += skillWeight;
    });

    return Math.max(totalScore / maxPossibleScore, 0.15);
  }

  calculateTextSimilarity(text1, text2) {
    const words1 = String(text1).toLowerCase().split(/\W+/).filter(Boolean);
    const words2 = String(text2).toLowerCase().split(/\W+/).filter(Boolean);
    
    if (!words1.length || !words2.length) return 0;
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  generateMatchingMetrics() {
    const maxSlotsPerCompany = 2;
    const results = [];
    
    const allScores = this.students.map(student => {
      const scores = this.companies.map(company => {
        const skillMatch = this.calculateSkillMatch(student.skills || [], company.required_skills || []);
        const expMatch = this.calculateExperienceMatch(student.experience || [], company.job_descriptions || []);
        
        const finalScore = Math.min((skillMatch * 0.6 + expMatch * 0.4) * 1.2, 0.95);
        
        return {
          company: company.company_name,
          score: finalScore || 0.15, // Prevent NaN
          details: {
            skillMatch: (skillMatch * 100) || 15,
            experienceMatch: (expMatch * 100) || 15
          }
        };
      }).sort((a, b) => b.score - a.score);
      
      return { student: student.name, scores };
    });

    console.log('\nFinal Assignments:');
    
    allScores.forEach(studentScore => {
      const availableMatches = studentScore.scores.filter(match => {
        const currentAssignments = this.companyAssignments.get(match.company) || 0;
        return currentAssignments < maxSlotsPerCompany;
      });

      const topMatches = availableMatches.slice(0, 2);
      
      topMatches.forEach(match => {
        const current = this.companyAssignments.get(match.company) || 0;
        this.companyAssignments.set(match.company, current + 1);
      });

      console.log(`\nStudent: ${studentScore.student}`);
      topMatches.forEach(match => {
        console.log(`- Matched with ${match.company} (Score: ${(match.score * 100).toFixed(2)}%)`);
      });

      results.push({
        student: studentScore.student,
        matches: topMatches.map(match => ({
          company: match.company,
          bidirectionalScore: match.score,
          details: {
            student: {
              skillMatch: match.details.skillMatch,
              experienceMatch: match.details.experienceMatch
            }
          }
        }))
      });
    });

    console.log('\nCompany Assignment Summary:');
    this.companyAssignments.forEach((count, company) => {
      console.log(`${company}: ${count}/${maxSlotsPerCompany} slots filled`);
    });

    return results;
  }
}
