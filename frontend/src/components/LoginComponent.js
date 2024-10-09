import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import loginService from '../services/loginService';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginService.login(email, contrasenia);
            setMessage(response.data.message);
            setIsError(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error en el login');
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
                            backgroundColor: '#319795', // Verde personalizado
                            color: 'white', // Texto blanco
                            '&:hover': { 
                                backgroundColor: '#2d7a7b' // Color de hover más oscuro
                            } 
                        }}
                        className="chakra-button css-1jsinvw"
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
