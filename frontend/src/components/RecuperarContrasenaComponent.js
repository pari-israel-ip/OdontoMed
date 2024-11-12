import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, Alert, AlertIcon,HStack } from '@chakra-ui/react';
import recoveryService from '../services/recoveryService';
import { useNavigate } from 'react-router-dom';

const RecuperarContrasenaComponent = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    // Función para manejar el proceso de recuperación
    const handleRecovery = async () => {
        // Validación del formato del email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setMessage('Por favor ingresa un correo electrónico válido');
            setIsError(true);
            return;
        }

        try {
            // Enviar solicitud al backend
            const { data } = await recoveryService.sendRecoveryCode(email); // Enviar email al servicio

            // Manejo de la respuesta exitosa
            setMessage(data.message);  // Usar el mensaje del backend
            setIsError(false);

            // Redirigir al usuario a la página de verificación del código
            navigate('/verificar-codigo');
        } catch (error) {
            // Manejo de errores
            const errorMessage = error.response?.data?.message || 'Error al enviar el código de recuperación';
            setMessage(errorMessage);
            setIsError(true);
        }
    };

    return (
        
        <Box maxW="md" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <HStack spacing={4} mb={4}>
                <Button onClick={() => navigate(-1)} colorScheme="teal">
                    Atrás
                </Button>
               
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">Recuperar Contraseña</Text>
            <VStack spacing={4}>
            
                <FormControl isRequired>
                    <FormLabel>Correo Electrónico:</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  // Actualizar el estado del email
                        placeholder="Ingresa tu correo electrónico"
                    />
                </FormControl>
                <Button 
                    onClick={handleRecovery}  // Llamar la función de recuperación
                    sx={{ 
                        backgroundColor: '#319795',
                        color: 'white',
                        '&:hover': { 
                            backgroundColor: '#2d7a7b'  // Cambiar el color de hover
                        } 
                    }}
                    width="full"
                >
                    Enviar Código de Recuperación
                </Button>
            </VStack>

            {message && (  // Mostrar mensaje si existe
                <Alert status={isError ? 'error' : 'success'} mt={4}>
                    <AlertIcon />
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default RecuperarContrasenaComponent;