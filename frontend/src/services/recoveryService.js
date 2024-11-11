// src/services/recoveryService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/odomed';

const recoveryService = {
    sendRecoveryCode: async (email) => {
        return await axios.get(`${API_URL}/recuperar_contrasena/`, { params: { email } });
    },
    verifyCodeAndChangePassword: async (codigo, nuevaContrasena, confirmarContrasena, email) => {
        return await axios.post(`${API_URL}/cambiar-contrasena/`, {
            codigo,
            nueva_contrasena: nuevaContrasena,
            confirmar_contrasena: confirmarContrasena,
            email
        });
    }
};

export default recoveryService;
