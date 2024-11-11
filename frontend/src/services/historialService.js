// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/historial/';  // Ajusta según tu configuración

const historialService = {
    getHistorial: () => axios.get(API_URL),
    //getRole: (id) => axios.get(`${API_URL}${id}/`),
    //createRole: (roleData) => axios.post(`${API_URL}create/`, roleData),
    updateHistorial: (id, historialData) => axios.put(`${API_URL}${id}/`, historialData),
    //deleteRole: (id) => axios.delete(`${API_URL}${id}/`)
};

export default historialService;
