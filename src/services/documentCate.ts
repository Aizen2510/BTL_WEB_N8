import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/categories'; // tuỳ chỉnh nếu backend bạn khác

export const getCategory = () => axios.get(API_BASE);
export const getCategoryById = (id: string) => axios.get(`${API_BASE}/${id}`);
export const createCategory = (data: Partial<category.Record>) => axios.post(API_BASE, data);
export const updateCategory = (id: string, data: Partial<category.Record>) => axios.put(`${API_BASE}/${id}`, data);
export const deleteCategory = (id: string) => axios.delete(`${API_BASE}/${id}`);
