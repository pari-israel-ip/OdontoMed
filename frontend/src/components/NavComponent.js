import React, { useState } from 'react';
import { Box, Flex, Text, Button, Spacer, Link, Image, IconButton, Collapse, VStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'; // Importa CloseIcon
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate

const NavComponent = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado para manejar el menú desplegable
    const navigate = useNavigate(); // Hook para redirigir a otra página

    const handleLoginRedirect = () => {
        navigate('/login'); // Redirige a la página de login
    };

    return (
        <Box bg="white" px={4} boxShadow="sm">
            <Flex h={16} alignItems="center" justifyContent="space-between">
                {/* Logo de la empresa */}
                <Box>
                    <Image src="/path-to-logo/odomed-logo.png" alt="OdontoMed Logo" boxSize="50px" />
                </Box>

                <IconButton
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />} // Cambia el icono según el estado
                    variant="outline"
                    bg="#319795" // Color del botón de hamburguesa
                    color="white" // Color del texto del botón
                    onClick={() => setIsOpen(!isOpen)} // Alterna el estado del menú
                    display={{ md: 'none' }} // Solo se muestra en pantallas pequeñas
                    width="48px" // Aumenta el ancho del botón de hamburguesa
                    height="48px" // Aumenta la altura del botón de hamburguesa
                />

                {/* Enlaces de navegación */}
                <Flex display={{ base: 'none', md: 'flex' }} alignItems="center" gap={6}>
                    <Link href="/acerca" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Acerca de</Text>
                    </Link>
                    <Link href="/servicios" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Servicios</Text>
                    </Link>
                    <Link href="/contacto" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Contacto</Text>
                    </Link>
                    <Text>951-79585650</Text>
                    {/* Botón de Ingresar en pantallas grandes */}
                    <Button
                        colorScheme="teal"
                        bg="#319795"
                        size="md"
                        borderRadius="md"
                        _hover={{ bg: '#28726D' }}
                        onClick={handleLoginRedirect}
                    >
                        Ingresar
                    </Button>
                </Flex>
            </Flex>

            {/* Menú desplegable para pantallas pequeñas */}
            <Collapse in={isOpen} animateOpacity>
                <VStack spacing={4} align="flex-start" p={4} display={{ md: 'none' }}>
                    <Link href="/acerca" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Acerca de</Text>
                    </Link>
                    <Link href="/servicios" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Servicios</Text>
                    </Link>
                    <Link href="/contacto" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Contacto</Text>
                    </Link>
                    <Text>951-79585650</Text>

                    {/* Botón de Ingresar en el menú desplegable */}
                    <Box width="full">
                        <Button
                            colorScheme="teal"
                            bg="#319795"
                            size="md"
                            borderRadius="md"
                            _hover={{ bg: '#28726D' }}
                            onClick={handleLoginRedirect}
                            width="full" // Asegúrate de que el botón ocupe todo el ancho disponible
                        >
                            Ingresar
                        </Button>
                    </Box>
                </VStack>
            </Collapse>
        </Box>
    );
};

export default NavComponent;
