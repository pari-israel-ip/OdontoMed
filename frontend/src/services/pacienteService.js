// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/paciente/';  // Ajusta según tu configuración

const pacienteService = {
    getPaciente: () => axios.get(API_URL),
    //getRole: (id) => axios.get(`${API_URL}${id}/`),
    //createRole: (roleData) => axios.post(`${API_URL}create/`, roleData),
    updatePaciente: (id, pacienteData) => axios.put(`${API_URL}${id}/`, pacienteData),
    //deleteRole: (id) => axios.delete(`${API_URL}${id}/`)
};

export default pacienteService;
