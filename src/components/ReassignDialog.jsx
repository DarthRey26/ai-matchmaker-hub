import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ReassignDialog = ({ studentId, companyField, currentCompany, companies, onReassign, disabled }) => {
  const [newCompany, setNewCompany] = useState('');

  const handleReassign = () => {
    if (newCompany && newCompany !== currentCompany) {
      onReassign(studentId, companyField, newCompany);
      setNewCompany('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2" disabled={disabled}>
          Reassign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reassign Company</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select value={newCompany} onValueChange={setNewCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleReassign} disabled={!newCompany || newCompany === currentCompany}>
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};