import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed/tratamiento/';  // Ajusta según tu configuración

const tratamientoService = {
    getTratamientosHistorial: (id) => axios.get(`${API_URL}historial/${id}/`),
    getTratamiento: (id) => axios.get(`${API_URL}${id}/`),
    createTratamiento: (tratamientoData) => axios.post(`${API_URL}create/`, tratamientoData),
    updateTratamiento: (id, tratamientoData) => axios.put(`${API_URL}${id}/`, tratamientoData),
    deleteTratamiento: (id) => axios.delete(`${API_URL}${id}/`)
};

export default tratamientoService;
