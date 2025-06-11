import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/category'; // Nếu cần, thay đổi base URL theo cấu hình backend

export const getCategory = () => {
  return axios.get(API_BASE);
};

export const getCategoryById = (id: string) => {
  return axios.get(`${API_BASE}/${id}`);
};

export const createCategory = (data: Partial<category.Record>) => {
  return axios.post(API_BASE, data);
};

export const updateCategory = (id: string, data: Partial<category.Record>) => {
  return axios.put(`${API_BASE}/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return axios.delete(`${API_BASE}/${id}`);
};
