import React, { useState } from 'react';
import { Box, Flex, Text, Button, Link, Image, IconButton, Collapse, VStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const NavComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Box bg="white" px={4} boxShadow="sm">
            <Flex h={16} alignItems="center" justifyContent="space-between">
                
                {/* Contenedor del botón hamburguesa */}
                <Box flex="1" display={{ base: 'flex', md: 'none' }} justifyContent="flex-start">
                    <IconButton
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        variant="outline"
                        bg="#319795"
                        color="white"
                        onClick={() => setIsOpen(!isOpen)}
                        width="48px"
                        height="48px"
                    />
                </Box>

                {/* Contenedor del logo */}
                <Box flex="1" display="flex" justifyContent={{ base: 'center', md: 'flex-start' }}>
                    <Image src="/path-to-logo/odomed-logo.png" alt="OdontoMed Logo" boxSize="50px" />
                </Box>

                {/* Enlaces de navegación (solo se muestran en pantallas grandes) */}
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="center"
                    gap={6}
                    flex="2"
                    justifyContent="center" // Centra los enlaces
                >
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
                </Flex>

                {/* Contenedor del botón de Ingresar */}
                <Box flex="1" display="flex" justifyContent="flex-end">
                    <Button
                        colorScheme="teal"
                        bg="#319795"
                        size="md"
                        borderRadius="md"
                        _hover={{ bg: '#28726D' }}
                        onClick={handleLoginRedirect}
                        display={{ base: 'block' }}
                    >
                        Ingresar
                    </Button>
                </Box>
            </Flex>

            {/* Menú desplegable para pantallas pequeñas */}
           <Collapse in={isOpen} animateOpacity>
    <VStack
        spacing={4}
        alignItems="start"
        p={4}
        display={{ md: 'none' }}
        width="100%" // Ocupa todo el ancho disponible
    >
        <Link href="/acerca" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
            <Text textAlign="left">Acerca de</Text>
        </Link>
        <Link href="/servicios" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
            <Text textAlign="left">Servicios</Text>
        </Link>
        <Link href="/contacto" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
            <Text textAlign="left">Contacto</Text>
        </Link>
        <Text width="100%" textAlign="left">951-79585650</Text>
    </VStack>
</Collapse>



        </Box>
    );
};

export default NavComponent;
