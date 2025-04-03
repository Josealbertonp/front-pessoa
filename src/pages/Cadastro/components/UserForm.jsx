import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Alert } from '@mui/material';
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

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

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
    const personToAdd = {
      ...newPerson,
      cpf: unformattedCPF,
      dataNascimento: newPerson.dataNascimento
    };

    try {
      if (editingRow) {
        await editUser(editingRow.id, personToAdd);

        setClientes((prevRows) =>
          prevRows.map((row) =>
            row.id === editingRow.id ? { ...personToAdd, id: editingRow.id } : row
          )
        );
      } else {
        await addUser(personToAdd);

        setClientes((prevRows) => [...prevRows, personToAdd]);
      }

      setAlert({
        open: true,
        message: editingRow ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!',
        severity: 'success',
      });


    } catch (error) {

      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.fieldErrors) {
          const fieldErrors = errorData.fieldErrors;
          const errorMessage = Object.entries(fieldErrors)
            .map(([field, message]) => `${message}`)
            .join('<br/>');

          setAlert({
            open: true,
            message: errorMessage,
            severity: 'error',
          });

        } else if (errorData) {
          setAlert({
            open: true,
            message: errorData,
            severity: 'error',
          });

        } else {
          setAlert({
            open: true,
            message: 'Ocorreu um erro ao salvar o usuário. Tente novamente.',
            severity: 'error',
          });
        }
      } else {
        setAlert({
          open: true,
          message: 'Erro desconhecido. Tente novamente.',
          severity: 'error',
        });
      }

    }
  };

  const handleCpfChange = (e) => {
    let rawCpf = e.target.value.replace(/\D/g, '');
    if (rawCpf.length <= 11) {
      setNewPerson({ ...newPerson, cpf: formatCPF(rawCpf) });
    }
  };

  useEffect(() => {
    if (alert.open && alert.severity === 'success') {
      const timer = setTimeout(() => {
        setAlert({ ...alert, open: false });
        setOpen(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert, setOpen]);


  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{editingRow ? 'Editar Pessoa' : 'Adicionar Pessoa'}</DialogTitle>
      <DialogContent>
        {alert.open && (
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, open: false })}
            style={{ marginBottom: '16px' }}
          >
            <span dangerouslySetInnerHTML={{ __html: alert.message }} />
          </Alert>
        )}

        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          value={newPerson.nome}
          onChange={(e) => setNewPerson({ ...newPerson, nome: e.target.value })}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="CPF"
          variant="outlined"
          fullWidth
          value={newPerson.cpf}
          onChange={handleCpfChange}
          error={!!errors.cpf}
          helperText={errors.cpf}
          slotProps={{
            input: {
              maxLength: 14,
            },
          }}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Data de Nascimento"
          variant="outlined"
          fullWidth
          type="date"
          value={newPerson.dataNascimento}
          onChange={(e) => setNewPerson({ ...newPerson, dataNascimento: e.target.value })}
          slotProps={{ shrink: true }}
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