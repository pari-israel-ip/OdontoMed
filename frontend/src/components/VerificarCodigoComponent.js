import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Alert, AlertIcon } from '@chakra-ui/react';
import recoveryService from '../services/recoveryService';
import { useNavigate } from 'react-router-dom';

const VerificarCodigoComponent = () => {
    const [codigo, setCodigo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const email = localStorage.getItem("email"); // asumiendo que guardaste el email en localStorage

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nuevaContrasena !== confirmarContrasena) {
            setMessage("Las contraseñas no coinciden");
            setIsError(true);
            return;
        }

        try {
            const response = await recoveryService.verifyCodeAndChangePassword(codigo, nuevaContrasena, confirmarContrasena, email);
            setMessage(response.data.message);
            setIsError(false);

            // Mostrar el mensaje por un tiempo antes de redirigir
            setTimeout(() => {
                navigate('/login');  // Redirige al login después de cambiar la contraseña
            }, 2000);  // Retrasar la redirección por 2 segundos (2000ms)
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error en la verificación del código');
            setIsError(true);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">Verificar Código</Text>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Código de Recuperación:</FormLabel>
                        <Input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Ingresa el código de recuperación"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Nueva Contraseña:</FormLabel>
                        <Input
                            type="password"
                            value={nuevaContrasena}
                            onChange={(e) => setNuevaContrasena(e.target.value)}
                            placeholder="Ingresa la nueva contraseña"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Confirmar Nueva Contraseña:</FormLabel>
                        <Input
                            type="password"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            placeholder="Confirma la nueva contraseña"
                        />
                    </FormControl>
                    <Button 
                        type="submit" 
                        colorScheme="teal" 
                        width="full"
                    >
                        Cambiar Contraseña
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

export default VerificarCodigoComponent;