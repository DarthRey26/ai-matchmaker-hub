import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

const MatchingViewRow = ({ match }) => {
  return (
    <TableRow>
      <TableCell>{match.student}</TableCell>
      <TableCell>{match.matches[0].company}</TableCell>
      <TableCell>{(match.matches[0].probability * 100).toFixed(2)}%</TableCell>
      <TableCell>{match.matches[1].company}</TableCell>
      <TableCell>{(match.matches[1].probability * 100).toFixed(2)}%</TableCell>
      <TableCell>{match.matches[2].company}</TableCell>
      <TableCell>{(match.matches[2].probability * 100).toFixed(2)}%</TableCell>
    </TableRow>
  );
};

export default MatchingViewRow;
