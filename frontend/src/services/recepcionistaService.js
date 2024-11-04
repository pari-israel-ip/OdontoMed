// src/services/roleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/recepcionista/';   // Ajusta según tu configuración

const recepcionistaService = {
   
    getRecepcionistas: () => axios.get(API_URL),
    getRecepcionista: (id) => axios.get(`${API_URL}${id}/`),
    createRecepcionistas: (recepcionistaData) => axios.post(`${API_URL}create/`, recepcionistaData),
    updateRecepcionistas: (id, recepcionistaData) => axios.put(`${API_URL}${id}/`, recepcionistaData),
    deleteRecepcionistas: (id) => axios.delete(`${API_URL}${id}/`)
};

export default recepcionistaService;
