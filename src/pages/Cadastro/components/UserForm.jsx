import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { addUser, editUser } from '../../../api/api';
import { formatCPF, isValidCPF, isValidEmail } from '../Utils/utils';

const UserForm = ({ open, setOpen, editingRow, setClientes, handleClose }) => {
  const [newPerson, setNewPerson] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
  });
  
  const [errors, setErrors] = useState({
    cpf: '',
    email: '',
    nome: '',
    dataNascimento: '',
  });

  useEffect(() => {
    if (editingRow) {
        
      setNewPerson({
        nome: editingRow.nome,
        cpf: formatCPF(editingRow.cpf),
        dataNascimento: editingRow.dataNascimento,
        email: editingRow.email,
      });
    } else {
      setNewPerson({ nome: '', cpf: '', dataNascimento: '', email: '' });
    }
  }, [editingRow]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = { cpf: '', email: '', nome: '', dataNascimento: '' };

    if (!newPerson.nome) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    if (!newPerson.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!isValidCPF(newPerson.cpf)) {
      newErrors.cpf = 'CPF inválido';
      isValid = false;
    }

    if (!newPerson.email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!isValidEmail(newPerson.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!newPerson.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
      isValid = false;
    }

    // Validação da data de nascimento
    const currentYear = new Date().getFullYear();
    const limitYear = 2025;
    const birthYear = new Date(newPerson.dataNascimento).getFullYear();

    if (birthYear > limitYear) {
      newErrors.dataNascimento = 'A data de nascimento não pode ser maior que 2025';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveClick = async () => {
    if (!validateFields()) return;

    const unformattedCPF = newPerson.cpf.replace(/\D/g, '');
    const personToAdd = { ...newPerson, cpf: unformattedCPF, dataNascimento: newPerson.dataNascimento };

    try {
      if (editingRow) {
        await editUser(editingRow.id, personToAdd);
        setClientes((prevRows) =>
          prevRows.map((row) => (row.id === editingRow.id ? personToAdd : row))
        );
      } else {
        const newUser = await addUser(personToAdd);
        setClientes((prevRows) => [...prevRows, newUser]);
      }
      setOpen(false);
      handleClose();
      setNewPerson({ nome: '', cpf: '', dataNascimento: '', email: '' });
      setErrors({ cpf: '', email: '', nome: '', dataNascimento: '' });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{editingRow ? 'Editar Pessoa' : 'Adicionar Pessoa'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          value={newPerson.nome}
          onChange={(e) => setNewPerson({ ...newPerson, nome: e.target.value })}
          error={!!errors.nome}
          helperText={errors.nome}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="CPF"
          variant="outlined"
          fullWidth
          value={newPerson.cpf}
          onChange={(e) => setNewPerson({ ...newPerson, cpf: formatCPF(e.target.value) })}
          error={!!errors.cpf}
          helperText={errors.cpf}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Data de Nascimento"
          variant="outlined"
          fullWidth
          type="date"
          value={newPerson.dataNascimento}
          onChange={(e) => setNewPerson({ ...newPerson, dataNascimento: e.target.value })}
          InputLabelProps={{ shrink: true }}
          error={!!errors.dataNascimento}
          helperText={errors.dataNascimento}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={newPerson.email}
          onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          style={{ marginBottom: '16px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setOpen(false); handleClose(); }} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          {editingRow ? 'Salvar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
