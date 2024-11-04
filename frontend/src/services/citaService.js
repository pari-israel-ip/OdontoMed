// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/citas/';  // Ajusta según tu configuración

const roleService = {
    getCitas: () => axios.get(API_URL),
    getRole: (id) => axios.get(`${API_URL}${id}/`),
    createCitasAuto: () => axios.get(`${API_URL}crear_citas/`),
    createCita: (citaData) => axios.post(`${API_URL}create/`, citaData),
    updateCita: (id, citaData) => axios.put(`${API_URL}${id}/`, citaData),
    deleteCita: (id) => axios.delete(`${API_URL}${id}/`)
};

export default roleService;
