import axios from 'axios';

const LOGIN_API_URL = 'http://localhost:8000/odomed/login/';

const loginService = {
    login: async (email, contrasenia) => {
        try {
            const response = await axios.post(LOGIN_API_URL, { email, contrasenia });

            // Verificamos si la respuesta es exitosa
            if (response.status === 200) {
                // Guardamos los datos en localStorage
                const { email, nombres, apellidos, telefono, fecha_nacimiento, usuario_id } = response.data;

                localStorage.setItem('usuario_id', usuario_id);
                localStorage.setItem('email', email);
                localStorage.setItem('nombres', nombres);
                localStorage.setItem('apellidos', apellidos);
                localStorage.setItem('telefono', telefono);
                localStorage.setItem('fecha_nacimiento', fecha_nacimiento);

                // Opcionalmente, puedes devolver la respuesta para que el frontend maneje el estado
                return {
                    message: 'Login exitoso',
                    usuario_id,
                    email,
                    nombres,
                    apellidos,
                    telefono,
                    fecha_nacimiento,
                };
            } else {
                // Si el login falla, puedes manejar el error aquí
                return { message: 'Login fallido', error: true };
            }
        } catch (error) {
            console.error("Error al intentar hacer login", error);
            return { message: 'Error al intentar hacer login', error: true };
        }
    }
};

export default loginService;
