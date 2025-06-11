import axios from 'axios';

// Nếu dùng token thì cấu hình ở đây:
const api = axios.create({
  baseURL: 'http://localhost:3000/api/users',
  headers: {
    // Authorization: `Bearer ${localStorage.getItem('token')}`, // nếu cần
  },
});

export const getAllUsers = async () => {
  const res = await api.get('/');
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
