import axiosInstance from "../api/axiosInstance";

const BASE = "/products";

export const createProduct = (formData) =>
  axiosInstance.post(`${BASE}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProducts = (params = {}) =>
  axiosInstance.get(`${BASE}/all`, { params });

export const getProductById = (id) => axiosInstance.get(`${BASE}/${id}`);

export const updateProduct = (id, formData) =>
  axiosInstance.put(`${BASE}/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) => axiosInstance.delete(`${BASE}/delete/${id}`);