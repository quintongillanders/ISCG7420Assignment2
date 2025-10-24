import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';


axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export const getRooms = () => axios.get(`${API_URL}rooms/`);
export const getReservations = () => axios.get(`${API_URL}reservations/`);
export const createReservation = (data) => axios.post(`${API_URL}reservations/`, data);
export const createUser = (data) => axios.post(`${API_URL}users/`, data);
