// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/odontologo/';  // Ajusta según tu configuración

const odontologoService = {
    getOdontologos: () => axios.get(API_URL)
    //getOdontologos: (id) => axios.get(`${API_URL}${id}/`),
    //createOdontologos: (odontologoData) => axios.post(`${API_URL}create/`, odontologoData),
    //updateOdontologos: (id, odontologoData) => axios.put(`${API_URL}${id}/`, odontologoData),
    //deleteOdontologos: (id) => axios.delete(`${API_URL}${id}/`)
};

export default odontologoService;
