// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/prescripcion/';  // Ajusta según tu configuración

const prescripcionService = {
    getPrescripcionHistorial: (id) => axios.get(`${API_URL}historial/${id}/`),
    getPrescripcion: (id) => axios.get(`${API_URL}${id}/`),
    createDiagnostico: (DiagnosticoData) => axios.post(`${API_URL}create/`, DiagnosticoData),
    updatePrescripcion: (id, PrescripcionData) => axios.put(`${API_URL}${id}/`, PrescripcionData),
    deletePrescripcion: (id) => axios.delete(`${API_URL}${id}/`)
};

export default prescripcionService;
