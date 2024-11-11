import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import loginService from '../services/loginService';
import usuarioService from '../services/usuarioService';
import roleService from '../services/roleService';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    try {
        // Login usando el email y contraseña
        const response = await loginService.login(email, contrasenia);
        setMessage(response.data.message);
        setIsError(false);

        // Guardar el token en el local storage
        localStorage.setItem('token', response.data.token);

        // Obtener el usuario por email
        const userResponse = await usuarioService.getUsuarioPorEmail(email);
        console.log('Usuario Response:', userResponse.data);  // Depuración

        const userId = userResponse.data.id_usuario;
        if (!userId) {
            throw new Error('ID de usuario no encontrado');
        }
        const roleID = userResponse.data.rol;
        if (!roleID) {
            throw new Error('ID de rol no encontrado');
        }
        // Obtener el rol del usuario
        const roleResponse = await roleService.getRole(roleID);
        console.log('ROLE Response:', roleResponse.data);  // Depuración

        localStorage.setItem('role', roleResponse.data.nombre_rol);

        // Redirige a la ruta /usuarios
        navigate('/usuarios');
    } catch (error) {
        console.error(error);
        setMessage(error.response?.data?.message || error.message || 'Error en el login');
        setIsError(true);
    }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">Login</Text>
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
                    <Button 
                        type="submit" 
                        sx={{ 
                            backgroundColor: '#319795',
                            color: 'white',
                            '&:hover': { backgroundColor: '#2d7a7b' }
                        }}
                        width="full"
                    >
                        Login
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