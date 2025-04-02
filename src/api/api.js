import axios from 'axios';

// Criar instância do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Função para obter todos os usuários
export const getUsers = async () => {
  try {
    const response = await api.get('');
    console.log('Resposta de getUsers:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

// Função para cadastrar um usuário
export const addUser = async (user) => {
  try {
    const response = await api.post('/cadastrar', user);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    throw error;
  }
};

// Função para editar um usuário
export const editUser = async (id, user) => {
  try {
    const response = await api.put(`/alterar/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    throw error;
  }
};

// Função para excluir um usuário
export const deleteUser = async (id) => {
  try {
    await api.delete(`/deletar/${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};
