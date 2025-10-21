import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const getRooms = () => axios.get(API_URL + 'rooms/');
export const getReservations = () => axios.get(API_URL + 'reservations/');
export const createReservation = (data) => axios.post(API_URL + 'reservations/', data);