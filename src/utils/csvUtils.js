export const generateCSV = (data) => {
  const headers = ['Student Name', 'Company 1', 'Probability 1', 'Company 2', 'Probability 2', 'Company 3', 'Probability 3'];
  const csvRows = [
    headers.join(','),
    ...data.map(student => [
      student.name,
      student.matches[0].company,
      (student.matches[0].probability * 100).toFixed(2) + '%',
      student.matches[1].company,
      (student.matches[1].probability * 100).toFixed(2) + '%',
      student.matches[2].company,
      (student.matches[2].probability * 100).toFixed(2) + '%'
    ].join(','))
  ];
  return csvRows.join('\n');
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

export const generateCompanyDataCSV = (data) => {
  const headers = ['Company Name', 'Website', 'Number of Students', 'Monthly Allowance', 'Working Days', 'Company Description', 'Job Roles', 'Requirements'];
  const csvRows = [
    headers.join(','),
    ...data.map(company => [
      company.company_name,
      company.website,
      company.num_students,
      company.monthly_allowance,
      company.working_days,
      `"${company.company_description.replace(/"/g, '""')}"`,
      `"${company.job_roles.join('; ').replace(/"/g, '""')}"`,
      `"${company.requirements.join('; ').replace(/"/g, '""')}"`
    ].join(','))
  ];
  return csvRows.join('\n');
};
