import React, { useEffect, useState } from 'react';
import UserTable from './UserTable';
import UserForm from './UserForm';
import SearchInput from './SearchInput';
import AddButton from './AddButton';
import { getUsers, deleteUser } from '../../../api/api';
import Swal from 'sweetalert2';

const UserRegistration = () => {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setClientes(Array.isArray(response) ? response : [response]);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => setSearch(event.target.value);

  const handleEditClick = (cliente) => {
    setEditingCliente(cliente);
    setOpen(true);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        setClientes(clientes.filter((cliente) => cliente.id !== id));
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        Swal.fire('Erro!', 'Não foi possível excluir o usuário.', 'error');
      }
    }
  };

  const handleAddClick = () => {
    setEditingCliente(null);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setEditingCliente(null);
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SearchInput search={search} onSearchChange={handleSearchChange} />
        <AddButton onClick={handleAddClick} />
      </div>
      <UserTable
        rows={filteredClientes}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      {open && (
        <UserForm
          open={open}
          setOpen={setOpen}
          editingRow={editingCliente}
          setClientes={setClientes}
          handleClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default UserRegistration;
