import React from 'react';
import { TableCell } from '@/components/ui/table';
import { ReassignDialog } from './ReassignDialog';

export const CompanyCell = ({ student, companyField, companies, onReassign, disabled, showPercentage = true }) => {
  return (
    <TableCell>
      <div className="flex items-center justify-between">
        <span className="truncate max-w-[150px]">{student[companyField]}</span>
        <ReassignDialog
          studentId={student.id}
          companyField={companyField}
          currentCompany={student[companyField]}
          companies={companies}
          onReassign={onReassign}
          disabled={disabled}
        />
      </div>
    </TableCell>
  );
};
