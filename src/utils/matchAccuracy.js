export class MatchAccuracyEvaluator {
  constructor(bidirectionalMatches, originalMatches) {
    this.bidirectionalMatches = bidirectionalMatches;
    this.originalMatches = originalMatches;
    this.accuracyMetrics = new Map();
  }

  calculateMatchQuality(match) {
    return {
      bidirectionalScore: match.bidirectionalScore,
      balanceScore: 1 - Math.abs(match.studentPreference - match.companyPreference),
      skillFit: match.details.student.skillMatch,
      experienceFit: match.details.student.experienceMatch,
      overallQuality: (
        (match.bidirectionalScore * 0.4) +
        (match.balanceScore * 0.3) +
        (match.details.student.skillMatch * 0.2) +
        (match.details.student.experienceMatch * 0.1)
      )
    };
  }

  evaluateDistribution() {
    const companyAssignments = new Map();
    let totalVariance = 0;

    this.bidirectionalMatches.forEach(match => {
      const count = companyAssignments.get(match.companyId) || 0;
      companyAssignments.set(match.companyId, count + 1);
    });

    // Calculate distribution score
    const avgAssignments = [...companyAssignments.values()].reduce((a, b) => a + b, 0) / companyAssignments.size;
    companyAssignments.forEach(count => {
      totalVariance += Math.pow(count - avgAssignments, 2);
    });

    return 1 - (Math.sqrt(totalVariance / companyAssignments.size) / avgAssignments);
  }

  generateAccuracyReport() {
    const matchQualities = this.bidirectionalMatches.map(match => ({
      studentId: match.studentId,
      companyId: match.companyId,
      ...this.calculateMatchQuality(match)
    }));

    const distributionScore = this.evaluateDistribution();

    return {
      matches: matchQualities,
      distributionScore,
      averageMatchQuality: matchQualities.reduce((acc, m) => acc + m.overallQuality, 0) / matchQualities.length,
      recommendations: this.generateRecommendations(matchQualities)
    };
  }
}
