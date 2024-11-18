import React from 'react'
import { Box, Text, Button, VStack, Icon } from '@chakra-ui/react'
import { FaLock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgGradient="linear(to-r, gray.100, gray.200)"
            p={6}
        >
            <Box
                bg="white"
                shadow="lg"
                rounded="lg"
                textAlign="center"
                p={8}
                maxW="md"
            >
                <VStack spacing={4}>
                    <Icon as={FaLock} boxSize={12} color="#319795" />
                    <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                        Acceso Denegado
                    </Text>
                    <Text fontSize="md" color="gray.500">
                        No tienes permiso para acceder a esta página. Si crees que esto es un error, por favor contacta al administrador.
                    </Text>
                    <Button
                        bg="#319795"
                        color="white"
                        _hover={{ bg: "#287066" }} // Color más oscuro al pasar el mouse
                        variant="solid"
                        onClick={() => navigate('/')}
                    >
                        Volver al inicio
                    </Button>
                </VStack>
            </Box>
        </Box>
    )
}

export default Unauthorized;
