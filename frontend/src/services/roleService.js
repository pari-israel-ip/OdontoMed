// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/roles/';  // Ajusta según tu configuración

const roleService = {
    getRoles: () => axios.get(API_URL),
    getRole: (id) => axios.get(`${API_URL}${id}/`),
    createRole: (roleData) => axios.post(`${API_URL}create/`, roleData),
    updateRole: (id, roleData) => axios.put(`${API_URL}${id}/`, roleData),
    deleteRole: (id) => axios.delete(`${API_URL}${id}/`)
};

export default roleService;
