import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { formatDate } from '../Utils/utils';

const UserTable = ({ rows, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}  className="w-full max-h-[650px] overflow-auto border border-gray-300 rounded-lg shadow">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Data de Nascimento</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.nome}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.cpf}</TableCell>
              <TableCell>{formatDate(row.dataNascimento)}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(row)}>
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => onDelete(row.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
