import axiosInstance from "../api/axiosInstance";

const BASE = "/banners";

// ============================================================
// GET ALL BANNERS
// GET /api/banners/all
// ============================================================

export const getAllBanners = (params = {}) =>
  axiosInstance.get(`${BASE}/all`, { params });

// ============================================================
// GET BANNER BY ID
// GET /api/banners/:id
// ============================================================

export const getBannerById = (bannerId) =>
  axiosInstance.get(`${BASE}/${bannerId}`);

// ============================================================
// CREATE BANNER
// POST /api/banners/create
// formData must use field name "image" for the file
// ============================================================

export const createBanner = (formData) =>
  axiosInstance.post(`${BASE}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============================================================
// UPDATE BANNER
// PUT /api/banners/update/:id
// formData must use field name "image" for the file (optional)
// ============================================================

export const updateBanner = (bannerId, formData) =>
  axiosInstance.put(`${BASE}/update/${bannerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ============================================================
// DELETE BANNER
// DELETE /api/banners/delete/:id
// ============================================================

export const deleteBanner = (bannerId) =>
  axiosInstance.delete(`${BASE}/delete/${bannerId}`);

// ============================================================
// HELPER: build a full, browsable URL for a banner image
// (imageURL stored in DB is a relative path, e.g.
// /uploads/banners/xyz.png). Strips "/api" off the configured
// axiosInstance baseURL to get the server root.
// ============================================================

export const getBannerImageUrl = (imageURL) => {
  if (!imageURL) return "";
  if (imageURL.startsWith("http")) return imageURL;

  const serverRoot = (axiosInstance.defaults.baseURL || "").replace(
    /\/api\/?$/,
    ""
  );

  return `${serverRoot}${imageURL}`;
};