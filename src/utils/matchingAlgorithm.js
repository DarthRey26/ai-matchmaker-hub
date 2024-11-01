import natural from 'natural';
import { MatchManager } from './matchManager.js';
import { BidirectionalMatcher } from './bidirectionalMatching.js';
import { MatchAccuracyEvaluator } from './matchAccuracy.js';

const { TfIdf } = natural;
const tokenizer = new natural.WordTokenizer();

export function matchStudentsToCompanies(students, companies, maxSlotsPerCompany = 2) {
  const matchManager = new MatchManager(companies, maxSlotsPerCompany);
  const companyAssignments = new Map();
  
  // Initialize company assignments
  companies.forEach(company => {
    companyAssignments.set(company.company_name, 0);
  });

  if (!Array.isArray(students) || !Array.isArray(companies)) {
    console.error('Invalid input arrays');
    return [];
  }

  const tfidf = new TfIdf();
  console.log(`Processing ${students.length} students and ${companies.length} companies`);

  const processedStudents = students
    .filter(student => student && typeof student === 'object')
    .map(student => {
      // Enhance text processing for students
      const skillsText = (student?.skills?.join(' ') || '').repeat(3); // Give more weight to skills
      const experienceText = student?.experience?.map(exp => 
        `${exp.job_titles?.join(' ')} ${exp.description || ''}`
      ).join(' ').repeat(2);
      
      const text = [
        skillsText,
        experienceText,
        (student?.education || ''),
        student?.keywords?.join(' ') || ''
      ].join(' ').toLowerCase();
      
      const tokens = tokenizer.tokenize(text);
      tfidf.addDocument(tokens);
      
      return {
        name: student?.name?.replace(/^\d+-/, '') || 'Unknown Student',
        docIndex: tfidf.documents.length - 1,
        tokens,
        originalSkills: student?.skills || [],
        originalExperience: student?.experience || []
      };
    });

  const processedCompanies = companies
    .filter(company => company && typeof company === 'object')
    .map(company => {
      // Enhance text processing for companies
      const requiredSkills = (company?.required_skills?.join(' ') || '').repeat(3);
      const jobDescriptions = company?.job_descriptions ? 
        company.job_descriptions.join(' ').repeat(2) : '';
      
      const text = [
        requiredSkills,
        jobDescriptions,
        company?.company_name || '',
        company?.company_description || '',
        company?.number_of_students?.map(s => s.position).join(' ') || ''
      ].join(' ').toLowerCase();
      
      const tokens = tokenizer.tokenize(text);
      tfidf.addDocument(tokens);
      
      return {
        name: company?.company_name || 'Unknown Company',
        docIndex: tfidf.documents.length - 1,
        tokens,
        originalSkills: company?.required_skills || [],
        originalDescriptions: company?.job_descriptions || []
      };
    });

  const initialMatches = processedStudents.map(student => {
    // Only get companies that haven't reached their capacity
    const availableCompanies = processedCompanies.filter(company => {
      const currentAssignments = companyAssignments.get(company.name) || 0;
      return currentAssignments < maxSlotsPerCompany;
    });

    const matches = availableCompanies
      .map(company => ({
        company: company.name,
        probability: calculateSimilarity(student, company),
        status: 'Not Yet',
        rejectionHistory: [],
        isLocked: false
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 2);

    // Update company assignments for the top matches
    matches.forEach(match => {
      const currentCount = companyAssignments.get(match.company) || 0;
      companyAssignments.set(match.company, currentCount + 1);
    });

    console.log(`Student ${student.name} matched with:`, 
      matches.map(m => `${m.company} (${(m.probability * 100).toFixed(2)}%)`));

    return {
      id: student.id || student.name,
      name: student.name,
      matches,
      currentAssignment: null,
      overflowStatus: false
    };
  });

  console.log('\nFinal company assignments:');
  companyAssignments.forEach((count, company) => {
    console.log(`${company}: ${count}/${maxSlotsPerCompany} slots filled`);
  });

  return initialMatches;
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * (vec2[i] || 0), 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2) || 0;
}

function calculateSimilarity(student, company) {
  // Enhanced TF-IDF vectorization
  const studentVec = new Array(student.tokens.length).fill(0);
  const companyVec = new Array(company.tokens.length).fill(0);
  
  // Calculate term frequencies
  student.tokens.forEach((token, i) => {
    const tf = student.tokens.filter(t => t === token).length;
    const idf = Math.log(totalDocuments / documentsWithTerm(token));
    studentVec[i] = tf * idf;
  });
  
  company.tokens.forEach((token, i) => {
    const tf = company.tokens.filter(t => t === token).length;
    const idf = Math.log(totalDocuments / documentsWithTerm(token));
    companyVec[i] = tf * idf;
  });

  // Apply domain-specific weights
  const weights = {
    skills: 2.0,
    experience: 1.5,
    education: 1.2,
    keywords: 1.0
  };

  // Weight the vectors based on token type
  studentVec.forEach((val, i) => {
    const token = student.tokens[i];
    if (isSkillToken(token)) studentVec[i] *= weights.skills;
    if (isExperienceToken(token)) studentVec[i] *= weights.experience;
    if (isEducationToken(token)) studentVec[i] *= weights.education;
  });

  return cosineSimilarity(studentVec, companyVec);
}

function isSkillToken(token) {
  const skillKeywords = ['programming', 'software', 'development', 'analysis', 'design', 
                        'management', 'leadership', 'communication', 'technical'];
  return skillKeywords.some(keyword => token.includes(keyword));
}

function isExperienceToken(token) {
  const expKeywords = ['years', 'experience', 'worked', 'led', 'managed', 'developed'];
  return expKeywords.some(keyword => token.includes(keyword));
}

function isEducationToken(token) {
  const eduKeywords = ['degree', 'university', 'bachelor', 'master', 'phd', 'certification'];
  return eduKeywords.some(keyword => token.includes(keyword));
}

export async function enhancedMatchingAlgorithm(students, companies) {
  const matchManager = new MatchManager(companies);
  const bidirectionalMatcher = new BidirectionalMatcher(students, companies);
  const bidirectionalMatches = bidirectionalMatcher.generateMatchingMetrics();
  
  const originalMatches = matchStudentsToCompanies(students, companies);
  
  const accuracyEvaluator = new MatchAccuracyEvaluator(bidirectionalMatches, originalMatches);
  const accuracyReport = accuracyEvaluator.generateAccuracyReport();
  
  return {
    enhancedMatches: combineMatchingResults(bidirectionalMatches, originalMatches),
    accuracyReport
  };
}

function combineMatchingResults(bidirectionalMatches, originalMatches) {
  return bidirectionalMatches.map(bidirectionalMatch => {
    const originalMatch = originalMatches.find(m => m.name === bidirectionalMatch.student);
    return {
      ...bidirectionalMatch,
      matches: bidirectionalMatch.matches.map(match => ({
        ...match,
        status: originalMatch?.matches.find(m => m.company === match.companyId)?.status || 'Not Yet'
      }))
    };
  });
}
