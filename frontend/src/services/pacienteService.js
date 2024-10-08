// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/pacientes/';    // Ajusta según tu configuración

const pacienteService = {
    getPacientes: () => axios.get(PACIENTE_API_URL),
    getPaciente: (id) => axios.get(`${PACIENTE_API_URL}${id}/`),
    createPaciente: (pacienteData) => axios.post(`${PACIENTE_API_URL}create/`, pacienteData),
    updatePaciente: (id, pacienteData) => axios.put(`${PACIENTE_API_URL}${id}/`, pacienteData),
    deletePaciente: (id) => axios.delete(`${PACIENTE_API_URL}${id}/`)
};

export default pacienteService;
