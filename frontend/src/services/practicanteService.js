
import axios from 'axios';


const PRACTICANTE_API_URL = 'http://localhost:8000/odomed/practicantes/';  // Ajusta según tu configuración

const practicanteService = {
    getPracticantes: () => axios.get(PRACTICANTE_API_URL),
    getPracticante: (id) => axios.get(`${PRACTICANTE_API_URL}${id}/`),
    createPracticante: (practicanteData) => axios.post(`${PRACTICANTE_API_URL}create/`, practicanteData),
    updatePracticante: (id, practicanteData) => axios.put(`${PRACTICANTE_API_URL}${id}/`, practicanteData),
    deletePracticante: (id) => axios.delete(`${PRACTICANTE_API_URL}${id}/`)
};

export default practicanteService;