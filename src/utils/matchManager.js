export class MatchManager {
  constructor(companies, maxSlotsPerCompany = 2) {
    this.companySlots = new Map();
    this.companyCapacity = new Map();
    this.rejectionHistory = new Map();
    this.acceptanceHistory = new Map();
    
    companies.forEach(company => {
      const companyName = company.company_name || company;
      this.companySlots.set(companyName, 0);
      this.companyCapacity.set(companyName, maxSlotsPerCompany);
    });
    
    console.log('Initialized company capacities:', 
      Array.from(this.companyCapacity.entries())
        .map(([company, capacity]) => `${company}: ${capacity}`)
    );
  }

  canAcceptStudent(companyName) {
    const currentSlots = this.companySlots.get(companyName) || 0;
    const capacity = this.companyCapacity.get(companyName) || 2;
    return currentSlots < capacity;
  }

  acceptStudent(studentId, companyName) {
    if (this.canAcceptStudent(companyName)) {
      this.companySlots.set(companyName, this.companySlots.get(companyName) + 1);
      this.acceptanceHistory.set(studentId, companyName);
      return true;
    }
    return false;
  }

  rejectStudent(studentId, companyName, reason = '') {
    this.rejectionHistory.set(`${studentId}-${companyName}`, {
      timestamp: new Date(),
      reason
    });
  }

  isStudentRejected(studentId, companyName) {
    return this.rejectionHistory.has(`${studentId}-${companyName}`);
  }

  isStudentAccepted(studentId) {
    return this.acceptanceHistory.has(studentId);
  }

  getCompanySlots(companyName) {
    return this.companySlots.get(companyName) || 0;
  }
}
