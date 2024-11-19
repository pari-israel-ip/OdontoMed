import React, { useState } from 'react';
import { Box, Flex, Text, Button, Link, Image, IconButton, Collapse, VStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const NavComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleScrollToServices = () => {
        // Desplaza a la sección de servicios
        const servicesSection = document.getElementById('services-section');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Box bg="white" px={4} boxShadow="sm">
            <Flex h={16} alignItems="center" justifyContent="space-between">
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

                <Box flex="1" display="flex" justifyContent={{ base: 'center', md: 'flex-start' }}>
                    <Link href="/">
                        <Image
                            src="https://i.ibb.co/FKcjVZX/Screenshot-2024-11-18-at-14-17-24.png"
                            alt="OdontoMed Logo"
                            width="150px"
                            height="50px"
                            cursor="pointer"
                        />
                    </Link>
                </Box>

                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="center"
                    gap={6}
                    flex="2"
                    justifyContent="center"
                >
                    <Link href="/acerca" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Acerca de</Text>
                    </Link>
                    {/* Botón para desplazarse a Servicios */}
                    <Button
                        variant="link"
                        color="gray.700"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                        onClick={handleScrollToServices}
                    >
                        Servicios
                    </Button>
                    <Link href="/contacto" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Contacto</Text>
                    </Link>
                    <Text>951-79585650</Text>
                </Flex>

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
                    width="100%"
                >
                    <Link href="/acerca" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Acerca de</Text>
                    </Link>
                    <Button
                        variant="link"
                        width="100%"
                        color="gray.700"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                        onClick={handleScrollToServices}
                    >
                        Servicios
                    </Button>
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
