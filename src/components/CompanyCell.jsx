import React from 'react';
import { TableCell } from '@/components/ui/table';
import { ReassignDialog } from './ReassignDialog';
import { Badge } from "@/components/ui/badge";

export const CompanyCell = ({ student, companyField, matchField, companies, onReassign, disabled }) => {
  return (
    <TableCell>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="truncate max-w-[120px]">{student[companyField]}</span>
          <Badge variant="secondary">{student[matchField]}%</Badge>
        </div>
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
