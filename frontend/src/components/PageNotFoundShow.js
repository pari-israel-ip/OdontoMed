import React from 'react'
import { Box, Text, Button, VStack, Icon } from '@chakra-ui/react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgGradient="linear(to-r, gray.100, gray.300)"
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
                    <Icon as={FaExclamationTriangle} boxSize={12} color="#319795" />
                    <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                        Página No Encontrada
                    </Text>
                    <Text fontSize="md" color="gray.500">
                        No pudimos encontrar la página que estabas buscando. Es posible que haya sido movida o eliminada, o que el enlace no sea correcto.
                    </Text>
                    <VStack spacing={3} w="100%">
                        <Button
                            bg="#319795"
                            color="white"
                            _hover={{ bg: "#287066" }}
                            variant="solid"
                            w="100%"
                            onClick={() => navigate('/')}
                        >
                            Ir a la página de inicio
                        </Button>
                        <Button
                            colorScheme="gray"
                            variant="outline"
                            w="100%"
                            onClick={() => navigate(-2)}
                        >
                            Regresar a la página anterior
                        </Button>
                    </VStack>
                </VStack>
            </Box>
        </Box>
    )
}

export default NotFoundPage
