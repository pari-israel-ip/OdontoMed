// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/diagnostico/';  // Ajusta según tu configuración

const diagnosticoService = {
    getDiagnosticoHistorial: (id) => axios.get(`${API_URL}historial/${id}/`),
    getDiagnostico: (id) => axios.get(`${API_URL}${id}/`),
    createDiagnostico: (DiagnosticoData) => axios.post(`${API_URL}create/`, DiagnosticoData),
    updateDiagnostico: (id, DiagnosticoData) => axios.put(`${API_URL}${id}/`, DiagnosticoData),
    //deleteRole: (id) => axios.delete(`${API_URL}${id}/`)
};

export default diagnosticoService;
