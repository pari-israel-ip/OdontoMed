// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/usuario/';  // Ajusta según tu configuración

const usuarioService = {
    getUsuarios: () => axios.get(API_URL),
    getUsuario: (id) => axios.get(`${API_URL}${id}/`),
    createUsuario: (usuarioData) => axios.post(`${API_URL}create/`, usuarioData),
    updateUsuario: (id, usuarioData) => axios.put(`${API_URL}${id}/`, usuarioData),
    deleteUsuario: (id) => axios.delete(`${API_URL}${id}/`)
};

export default usuarioService;
