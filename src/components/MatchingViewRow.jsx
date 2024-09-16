import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyCell } from './CompanyCell';
import { OutcomeCell } from './OutcomeCell';
import { DetailDialog } from './DetailDialog';

export const MatchingViewRow = ({ student, companies, onOutcomeChange, onReassign, onBackupCompanyChange }) => {
  return (
    <TableRow>
      <TableCell>{student.name}</TableCell>
      <TableCell>{student.school}</TableCell>
      <TableCell>{student.faculty}</TableCell>
      <CompanyCell
        student={student}
        companyField="company1"
        companies={companies}
        onReassign={onReassign}
      />
      <OutcomeCell
        student={student}
        outcomeField="outcome1"
        onOutcomeChange={onOutcomeChange}
      />
      <CompanyCell
        student={student}
        companyField="company2"
        companies={companies}
        onReassign={onReassign}
        disabled={student.outcome1 === 'Accepted'}
      />
      <OutcomeCell
        student={student}
        outcomeField="outcome2"
        onOutcomeChange={onOutcomeChange}
        disabled={student.outcome1 === 'Accepted'}
      />
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline">{student.backupCompany || 'None'}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Backup Company</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <DetailDialog 
          student={student} 
          companies={companies}
          onBackupCompanyChange={onBackupCompanyChange}
        />
      </TableCell>
    </TableRow>
  );
};
