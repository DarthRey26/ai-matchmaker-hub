import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReassignDialog } from './ReassignDialog';

export const CompanyCell = ({ student, companyField, companies, onReassign, disabled }) => {
  return (
    <TableCell>
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <span className="mr-2 truncate max-w-[120px]">{student[companyField]}</span>
                <Badge variant="secondary" className="w-16 text-center">
                  {student[`match${companyField.slice(-1)}`]}%
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{student[companyField]}</p>
              <p>Match percentage: {student[`match${companyField.slice(-1)}`]}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
