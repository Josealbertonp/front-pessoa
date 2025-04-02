import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { addUser, deleteUser, editUser, getPessoas } from '../../api/api';

const formatCPF = (cpf) => {
    return cpf
        .replace(/\D/g, '') 
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        .slice(0, 14);
};

const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return '';
    const [day, month, year] = dateArray;
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; 
};

const StyledPaper = styled('div')(({ theme }) => ({
    width: '90%',
    height: '90%',
    marginTop: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
    overflow: 'hidden',
}));

const EditableTable = () => {
    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [newPerson, setNewPerson] = useState({ nome: '', cpf: '', dataNascimento: '', email: '' });

    const getPessoa = async () => {
        try {
            const response = await getPessoas();
            if (Array.isArray(response)) {
                setRows(response);
            } else if (response && typeof response === 'object') {
                setRows([response]);
            } else {
                console.error('A resposta da API não é nem um objeto nem um array:', response);
                setRows([]);
            }
        } catch (error) {
            console.error('Erro ao buscar os usuários:', error);
        }
    };

    const cadastrarPessoa = async () => {
        const unformattedCPF = newPerson.cpf.replace(/\D/g, '');

        const personToAdd = {
            ...newPerson,
            cpf: unformattedCPF,
            dataNascimento: newPerson.dataNascimento.split('-').map(Number)
        };

        try {
            const response = await addUser(personToAdd);
            if (response) {
                setRows([...rows, response]);
                setOpen(false);
                setNewPerson({ nome: '', cpf: '', dataNascimento: '', email: '' });
            }
        } catch (error) {
            console.error('Erro ao cadastrar o usuário:', error);
        }
    };

    const editarPessoa = async (id) => {
        const unformattedCPF = newPerson.cpf.replace(/\D/g, '');

        const personToAdd = {
            ...newPerson,
            cpf: unformattedCPF,
            dataNascimento: convertDateToAmericanFormat(newPerson.dataNascimento)
        };

        try {
            const response = await editUser(id, personToAdd);
            if (response) {
                setOpen(false);
                getPessoa();
                setNewPerson({ nome: '', cpf: '', dataNascimento: '', email: '' });
            }
        } catch (error) {
            console.error('Erro ao cadastrar o usuário:', error);
        }
    };

    useEffect(() => {
        getPessoa();
    }, []);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleEditClick = (row) => {
        setEditingRow(row);
        setNewPerson({
            nome: row.nome,
            cpf: row.cpf,
            dataNascimento: formatDate(row.dataNascimento),
            email: row.email
        });
        setOpen(true);
    };

    const handleSaveClick = (id) => {
        if (editingRow) {
            editarPessoa(id);
            setRows(updatedRows);
        } else {
            cadastrarPessoa();
        }
        setOpen(false);
    };

    const handleDeleteClick = async (id) => {
        try {
            await deleteUser(id);
            
            setRows(rows.filter((row) => row.id !== id));
        } catch (error) {
            console.error('Erro ao excluir o usuário:', error);
        }
    };
    

    const handleClose = () => {
        setOpen(false);
        setNewPerson({ nome: '', cpf: '', dataNascimento: '', email: '' });
    };

    const handleCPFChange = (e) => {
        const formattedCPF = formatCPF(e.target.value);
        setNewPerson({ ...newPerson, cpf: formattedCPF });
    };

    const handleDateChange = (e) => {
        setNewPerson({ ...newPerson, dataNascimento: e.target.value });
    };

    const filteredRows = rows.filter(
        (row) =>
            row.nome.toLowerCase().includes(search.toLowerCase())
    );

    const convertDateToAmericanFormat = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    return (
        <div
            style={{
                height: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}
        >
            <StyledPaper>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', width: '90%', justifyContent: 'space-between' }}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        value={search}
                        onChange={handleSearchChange}
                        style={{
                            marginBottom: '16px',
                            marginRight: '16px',
                            width: '50%',
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpen(true)}
                    >
                        Adicionar
                    </Button>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>CPF</TableCell>
                                <TableCell>Data Nascimento</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredRows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.nome}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.cpf}</TableCell>
                                    <TableCell>{formatDate(row.dataNascimento)}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditClick(row)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleDeleteClick(row.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </StyledPaper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingRow ? 'Editar Pessoa' : 'Adicionar Pessoa'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        value={newPerson.nome}
                        onChange={(e) =>
                            setNewPerson({ ...newPerson, nome: e.target.value })
                        }
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="CPF"
                        variant="outlined"
                        fullWidth
                        value={newPerson.cpf}
                        onChange={handleCPFChange}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="Data de Nascimento"
                        variant="outlined"
                        fullWidth
                        type="date"
                        value={newPerson.dataNascimento}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="E-mail"
                        variant="outlined"
                        fullWidth
                        type="email"
                        value={newPerson.email}
                        onChange={(e) =>
                            setNewPerson({ ...newPerson, email: e.target.value })
                        }
                        style={{ marginBottom: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleSaveClick(editingRow?.id)} color="primary">
                        {editingRow ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditableTable;
