export const generateCSV = (students) => {
  const headers = ['Name', 'School', 'Faculty', 'Company 1', '1st Outcome', 'Company 2', '2nd Outcome', 'Backup Company'];
  const rows = students.map(student => [
    student.name,
    student.school,
    student.faculty,
    student.company1,
    student.outcome1,
    student.company2,
    student.outcome2,
    student.backupCompany || 'None'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};