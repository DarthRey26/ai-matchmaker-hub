import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyCell } from './CompanyCell';
import { OutcomeCell } from './OutcomeCell';
import { DetailDialog } from './DetailDialog';

export const MatchingViewRow = ({ student, companies, onOutcomeChange, onReassign, onBackupCompanyChange }) => {
  return (
    <>
      <TableRow>
        <TableCell rowSpan={2}>{student.name}</TableCell>
        <TableCell rowSpan={2}>{student.school}</TableCell>
        <TableCell rowSpan={2}>{student.faculty}</TableCell>
        <CompanyCell
          student={student}
          companyField="company1"
          companies={companies.map(c => c.name)}
          onReassign={onReassign}
          showPercentage={false}
        />
        <OutcomeCell
          student={student}
          outcomeField="outcome1"
          onOutcomeChange={onOutcomeChange}
        />
        <CompanyCell
          student={student}
          companyField="company2"
          companies={companies.map(c => c.name)}
          onReassign={onReassign}
          disabled={student.outcome1 === 'Accepted'}
          showPercentage={false}
        />
        <OutcomeCell
          student={student}
          outcomeField="outcome2"
          onOutcomeChange={onOutcomeChange}
          disabled={student.outcome1 === 'Accepted'}
        />
        <TableCell rowSpan={2}>
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
        <TableCell rowSpan={2}>
          <DetailDialog 
            student={student} 
            companies={companies}
            onBackupCompanyChange={onBackupCompanyChange}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text-center">{student.match1}%</TableCell>
        <TableCell></TableCell>
        <TableCell className="text-center">{student.match2}%</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </>
  );
};
