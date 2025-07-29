// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // URL của json-server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = (params) => apiClient.get('/products', { params });
export const getProductById = (id) => apiClient.get(`/products/${id}`);
export const createProduct = (product) => apiClient.post('/products', product);
export const updateProduct = (id, product) => apiClient.put(`/products/${id}`, product);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

export const getCategories = () => apiClient.get('/categories');
export const getCategoryById = (id) => apiClient.get(`/categories/${id}`);
export const createCategory = (category) => apiClient.post('/categories', category);
export const updateCategory = (id, category) => apiClient.put(`/categories/${id}`, category);

export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`); 