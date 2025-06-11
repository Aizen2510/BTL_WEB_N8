import axios from 'axios';

const API_URL = 'http://localhost:3000/api/documents';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
        Authorization: `Bearer ${token}`,
  };
};

export const getAllDocuments = () => {
    return axios.get(`${API_URL}`, { headers: getAuthHeaders() });
};

export const getDocumentById = (id: string) => {
    return axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

export const createDocument = (data: any) => {
    return axios.post(`${API_URL}/createDoc`, data, { headers: getAuthHeaders() });
};

export const updateDocument = (id: string, data: any) => {
    return axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
};

//
export const deleteDocument = (id: string) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

export const approveDocument = (id: string) => {
    return axios.put(`${API_URL}/${id}/approve`, {}, { headers: getAuthHeaders() });
};

export const rejectDocument = (id: string) => {
    return axios.put(`${API_URL}/${id}/approval`, { isApproved: 'rejected' }, { headers: getAuthHeaders() });
};

export const getMyDocuments = () => {
    return axios.get(`${API_URL}/my`, {headers: getAuthHeaders()});
};
export const getPendingDocuments = () => {
    return axios.get(`${API_URL}/pending`, { headers: getAuthHeaders() });
};

export const downloadDocument = (id: string) => {
    return axios.get(`${API_URL}/${id}/download`, { headers: getAuthHeaders() });
};

export const uploadDocument = (data: any) => {
    return axios.post(`${API_URL}/upload`, data, { headers: getAuthHeaders() });
};

export const getMyDocumentById = (id: string) => {
    return axios.get(`${API_URL}/my/${id}`, { headers: getAuthHeaders() });
};

export const updateMyDocument = (id: string, data: any) => {
    return axios.put(`${API_URL}/my/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteMyDocument = (id: string) => {
    return axios.delete(`${API_URL}/my/${id}`, { headers: getAuthHeaders() });
};

// api add doc ad 
export const createAdminDocument = (data: any) => {
  return axios.post(`${API_URL}/admin/create`, data, {
    headers: getAuthHeaders(),
  });
};
