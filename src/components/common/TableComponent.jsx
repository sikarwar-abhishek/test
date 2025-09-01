import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const TableComponent = ({ columns, data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell key={`${rowIndex}-${col.key}`}>
                {row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
