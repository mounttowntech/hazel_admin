import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5004/api";

const NEW_ARRIVAL_URL = `${API_BASE_URL}/newArrivals`;

// ==========================================================
// GET ALL NEW ARRIVALS
// ==========================================================

export const getAllNewArrivals = async () => {
  const response = await axios.get(
    `${NEW_ARRIVAL_URL}/all`
  );

  return response.data;
};

// ==========================================================
// GET NEW ARRIVAL BY ID
// ==========================================================

export const getNewArrivalById = async (id) => {
  const response = await axios.get(
    `${NEW_ARRIVAL_URL}/${id}`
  );

  return response.data;
};

// ==========================================================
// CREATE NEW ARRIVAL
// ==========================================================

export const createNewArrival = async (formData) => {
  const response = await axios.post(
    `${NEW_ARRIVAL_URL}/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================================================
// UPDATE NEW ARRIVAL
// ==========================================================

export const updateNewArrival = async (
  id,
  formData
) => {
  const response = await axios.put(
    `${NEW_ARRIVAL_URL}/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================================================
// DELETE NEW ARRIVAL
// ==========================================================

export const deleteNewArrival = async (id) => {
  const response = await axios.delete(
    `${NEW_ARRIVAL_URL}/delete/${id}`
  );

  return response.data;
};

// ==========================================================
// IMAGE URL
// ==========================================================

export const getNewArrivalImageUrl = (image) => {
  if (!image) {
    return null;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const serverUrl = API_BASE_URL.replace(
    "/api",
    ""
  );

  return `${serverUrl}/${image.replace(/^\/+/, "")}`;
};