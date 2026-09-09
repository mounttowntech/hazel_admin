import axiosInstance from "../api/axiosInstance";

const BASE = "/banner-products";

// ============================================================
// GET ALL BANNER PRODUCTS
// GET /api/banner-products/all
// ============================================================

export const getAllBannerProducts = (params = {}) =>
  axiosInstance.get(`${BASE}/all`, { params });

// ============================================================
// GET PRODUCTS BY BANNER ID
// GET /api/banner-products/banner/:bannerId
// ============================================================

export const getProductsByBannerId = (bannerId) =>
  axiosInstance.get(`${BASE}/banner/${bannerId}`);

// ============================================================
// GET SINGLE BANNER PRODUCT
// GET /api/banner-products/:id
// ============================================================

export const getBannerProductById = (id) =>
  axiosInstance.get(`${BASE}/${id}`);

// ============================================================
// CREATE BANNER PRODUCT
// POST /api/banner-products/create
// payload: { bannerId, productId }
// ============================================================

export const createBannerProduct = ({ bannerId, productId }) =>
  axiosInstance.post(`${BASE}/create`, { bannerId, productId });

// ============================================================
// UPDATE BANNER PRODUCT
// PUT /api/banner-products/update/:id
// payload: { bannerId?, productId? }
// ============================================================

export const updateBannerProduct = (id, { bannerId, productId }) =>
  axiosInstance.put(`${BASE}/update/${id}`, { bannerId, productId });

// ============================================================
// DELETE BANNER PRODUCT
// DELETE /api/banner-products/delete/:id
// ============================================================

export const deleteBannerProduct = (id) =>
  axiosInstance.delete(`${BASE}/delete/${id}`);