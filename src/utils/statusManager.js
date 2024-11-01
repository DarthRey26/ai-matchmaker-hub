export class StatusManager {
  constructor(initialMatches) {
    this.matches = initialMatches;
    this.companySlots = {};
    this.rejectionHistory = new Map();
  }

  updateStatus(studentId, companyId, newStatus) {
    const student = this.matches.find(m => m.id === studentId);
    if (!student) return false;

    const match = student.matches.find(m => m.company === companyId);
    if (!match) return false;

    const previousStatus = match.status;
    match.status = newStatus;

    if (newStatus === 'Accepted') {
      this.handleAcceptance(student, match);
    } else if (newStatus === 'Rejected') {
      this.handleRejection(student, match);
    }

    return true;
  }

  handleAcceptance(student, match) {
    student.isLocked = true;
    student.currentAssignment = match.company;
    this.companySlots[match.company]++;
  }

  handleRejection(student, match) {
    this.rejectionHistory.set(
      `${student.id}-${match.company}`,
      { timestamp: new Date(), reason: match.rejectionReason || 'No reason provided' }
    );
  }
}
