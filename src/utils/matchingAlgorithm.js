import natural from 'natural';
import { BidirectionalMatcher } from './bidirectionalMatching.js';

const { TfIdf } = natural;
const tokenizer = new natural.WordTokenizer();

export function matchStudentsToCompanies(students, companies) {
  if (!Array.isArray(students) || !Array.isArray(companies)) {
    console.error('Invalid input arrays');
    return [];
  }

  const bidirectionalMatcher = new BidirectionalMatcher(students, companies);
  return bidirectionalMatcher.generateMatchingMetrics();
}

export async function enhancedMatchingAlgorithm(students, companies) {
  const bidirectionalMatcher = new BidirectionalMatcher(students, companies);
  const matches = bidirectionalMatcher.generateMatchingMetrics();
  
  return {
    matches,
    accuracyReport: {
      averageMatchQuality: matches.reduce((acc, m) => 
        acc + m.matches.reduce((sum, match) => sum + match.bidirectionalScore, 0) / m.matches.length, 
      0) / matches.length
    }
  };
}