import axios from "axios";

// Dynamically pick backend URL based on environment
export const BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// Create a reusable Axios instance
const API = axios.create({
  baseURL: BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Helper function to attach JWT token automatically
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// --- AUTH ---
export const registerUser = (data) => API.post("register/", data);

export const loginUser = async (data) => {
  try {
    console.log("Attempting login with data:", data);
    const response = await API.post("token/", data);
    console.log("Login successful, response:", response.data);
    return response;
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// --- ROOMS ---
export const getRooms = (token) => API.get("rooms/", authHeader(token));

// --- RESERVATIONS ---
export const getReservations = (token) =>
  API.get("reservations/", authHeader(token));

export const createReservation = (data, token) =>
  API.post("reservations/", data, authHeader(token));

// --- UPDATE Reservation ---
export const updateReservation = (id, data, token) =>
  API.patch(`reservations/${id}/`, data, authHeader(token));

// --- DELETE Reservation ---
export const deleteReservation = (id, token) =>
  API.delete(`reservations/${id}/`, authHeader(token));

// --- Utility Test ---
export const testAPI = async () => {
  try {
    const response = await API.get("");
    console.log("API connection successful:", response.status);
  } catch (error) {
    console.error("API connection failed:", error.message);
  }
};
