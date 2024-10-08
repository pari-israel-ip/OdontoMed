// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/odontologos/';    // Ajusta según tu configuración

const odontologoService = {
    getOdontologos: () => axios.get(ODONTOLOGO_API_URL),
    getOdontologo: (id) => axios.get(`${ODONTOLOGO_API_URL}${id}/`),
    createOdontologo: (odontologoData) => axios.post(`${ODONTOLOGO_API_URL}create/`, odontologoData),
    updateOdontologo: (id, odontologoData) => axios.put(`${ODONTOLOGO_API_URL}${id}/`, odontologoData),
    deleteOdontologo: (id) => axios.delete(`${ODONTOLOGO_API_URL}${id}/`)
};

export default odontologoService;
