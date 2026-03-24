import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadContract = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const validateContract = async (contractId) => {
  const response = await api.get(`/validate/${contractId}`);
  return response.data;
};

export const listContracts = async () => {
  const response = await api.get('/contracts');
  return response.data;
};

export const deleteContract = async (contractId) => {
  const response = await api.delete(`/contracts/${contractId}`);
  return response.data;
};

export const getTemplates = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export const searchClauses = async (query, topK = 5) => {
  const response = await api.post('/search', null, {
    params: { query, top_k: topK }
  });
  return response.data;
};

export default api;
