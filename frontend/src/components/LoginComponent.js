import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
    Alert,
    AlertIcon,
    HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/loginService';
import usuarioService from '../services/usuarioService';
import roleService from '../services/roleService';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const permisosMap = {
        1: 'Crear rol',
        2: 'Editar rol',
        3: 'Eliminar rol',
        4: 'Ver roles',
        8:'Descargar Historial',
        9:'Importar Paciente',
        10: 'Eliminar Paciente',
        11: 'Ver Pacientes',
        12: 'Crear Paciente',
        13: 'Ver Historial de Paciente',
        14: 'Editar Datos Personales',
        15: 'Editar Datos del Paciente',
        16: 'Editar Datos del Historial',
        17: 'Crear Diagnostico',
        18: 'Editar Diagnostico',
        19: 'Eliminar Diagnostico',
        20: 'Crear Tratamiento',
        21: 'Editar Tratamiento',
        22: 'Eliminar Tratamiento',
        23: 'Crear Prescripcion',
        24: 'Editar Prescripcion',
        25: 'Eliminar Prescripcion',
        31: 'Ver Odontólogos',
        32: 'Crear odontólogo',
        33: 'Eliminar odontólogo',
        34: 'Editar Datos Personales',
        35: 'Editar Datos de Odontólogo',
        41: 'Ver citas',
        42: 'Editar cita',
        43: 'Eliminar cita',
        51: 'Ver Recepcionistas',
        54:'Crear Recepcionista',
        52: 'Editar Recepcionista',
        53: 'Eliminar Recepcionista',
    };
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const response = await loginService.login(email, contrasenia);
            console.log("Respuesta del servidor:", response);

            if (response && response.data) {
                setMessage(response.data.message);
                setIsError(false);

                // Guardar el token y otros datos en localStorage
                localStorage.setItem('token', response.data.token);

                // Obtener el usuario por email
                const userResponse = await usuarioService.getUsuarioPorEmail(email);
                console.log('Usuario Response:', userResponse.data);
                console.log('id USUARIO',userResponse.data.id_usuario)
                const userId = userResponse.data.id_usuario;
                if (!userId) {
                    throw new Error('ID de usuario no encontrado');
                }
                const roleID = userResponse.data.rol;
                if (!roleID) {
                    throw new Error('ID de rol no encontrado');
                }
               

                // Obtener y almacenar el rol del usuario
                const roleResponse = await roleService.getRole(roleID);
                const permisosIds = roleResponse.data.permisos.split(',').map(Number); // Convertimos a array de números
                const permisos = permisosIds.map(id => permisosMap[id]).filter(Boolean); // Mapeamos a labels y filtramos valores no encontrados
                console.log('ROLE Response:', roleResponse.data);
                localStorage.setItem('permisos', JSON.stringify(permisos));
                localStorage.setItem('role', roleResponse.data.nombre_rol);
                localStorage.setItem('usuario_id', userResponse.data.id_usuario);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('nombres', response.data.nombres);
                localStorage.setItem('apellidos', response.data.apellidos);
                localStorage.setItem('telefono', response.data.telefono);
                localStorage.setItem('fecha_nacimiento', response.data.fecha_nacimiento);

                // Redirige a la ruta /usuarios
                navigate('/usuarios');
            } else {
                setMessage('Inicio de Sesión fallido');
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || error.message || 'Error en el inciio de sesión');
            setIsError(true);
        }finally{
            setLoading(false)
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            {/* Barra de navegación */}
            <HStack spacing={4} mb={4}>
                <Button onClick={() => navigate(-1)} colorScheme="teal">
                    Atrás
                </Button>
               
            </HStack>

            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">Inicio de Sesión</Text>
            <form onSubmit={handleLogin}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Email:</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu email"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Contraseña:</FormLabel>
                        <Input
                            type="password"
                            value={contrasenia}
                            onChange={(e) => setContrasenia(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                        />
                    </FormControl>
                    <Button isLoading={loading}
                        type="submit"
                        sx={{
                            backgroundColor: '#319795',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#2d7a7b'
                            }
                        }}
                        width="full"
                    >
                        Iniciar Sesión
                    </Button>
                    <Button
                        variant="link"
                        onClick={() => navigate('/recuperar-contrasena')}
                        colorScheme="teal"
                    >
                        ¿Olvidaste tu contraseña?
                    </Button>
                </VStack>
            </form>
            {message && (
                <Alert status={isError ? 'error' : 'success'} mt={4}>
                    <AlertIcon />
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default LoginComponent;
