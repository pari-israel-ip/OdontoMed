import axios from 'axios';
const RECEPCIONISTA_API_URL = 'http://localhost:8000/odomed/recepcionistas/';  // Ajusta según tu configuración

const recepcionistaService = {
    getRecepcionistas: () => axios.get(RECEPCIONISTA_API_URL),
    getRecepcionista: (id) => axios.get(`${RECEPCIONISTA_API_URL}${id}/`),
    createRecepcionista: (recepcionistaData) => axios.post(`${RECEPCIONISTA_API_URL}create/`, recepcionistaData),
    updateRecepcionista: (id, recepcionistaData) => axios.put(`${RECEPCIONISTA_API_URL}${id}/`, recepcionistaData),
    deleteRecepcionista: (id) => axios.delete(`${RECEPCIONISTA_API_URL}${id}/`)
};
export default recepcionistaService;