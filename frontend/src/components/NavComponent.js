import React, { useState } from 'react';
import { Box, Flex, Text, Button, Link, Image, IconButton, Collapse, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, SimpleGrid } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const NavComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
                            src="https://i.ibb.co/m6mt82H/Screenshot-2024-11-18-at-14-17-24-removebg-preview.png"
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
                    <Text
                        onClick={() => setIsAboutModalOpen(true)}
                        cursor="pointer"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                    >
                        Acerca de
                    </Text>
                    {/* Botón para desplazarse a Servicios */}
                    <Button
                        variant="link"
                        color="gray.700"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                        onClick={handleScrollToServices}
                    >
                        Servicios
                    </Button>
                    <Text
                        onClick={() => setIsContactModalOpen(true)}
                        cursor="pointer"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                    >
                        Contacto
                    </Text>
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
                    <Text
                        onClick={() => setIsAboutModalOpen(true)}
                        width="100%"
                        cursor="pointer"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                    >
                        Acerca de
                    </Text>
                    <Button
                        variant="link"
                        width="100%"
                        color="gray.700"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                        onClick={handleScrollToServices}
                    >
                        Servicios
                    </Button>
                    <Text
                        onClick={() => setIsContactModalOpen(true)}
                        width="100%"
                        cursor="pointer"
                        _hover={{ textDecoration: 'none', color: '#319795' }}
                    >
                        Contacto
                    </Text>
                    <Text width="100%" textAlign="left">951-79585650</Text>
                </VStack>
            </Collapse>

            {/* Modal Acerca de */}
            <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Acerca de OdontoMed</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            <Box>
                                <Text mb={4}>
                                    OdontoMed es una clínica odontológica de alta calidad, especializada en la atención personalizada para cada paciente. Ofrecemos una amplia gama de servicios, que incluyen tratamientos preventivos, estéticos y reconstructivos. Nuestro equipo de profesionales está comprometido con la salud dental, utilizando las últimas tecnologías para garantizar un tratamiento eficaz y seguro.
                                </Text>
                                <Text>
                                    Nuestro enfoque se basa en la confianza, la calidad y el confort de cada paciente, trabajando con las tecnologías más avanzadas y manteniendo un ambiente cálido y amigable. Desde tratamientos de ortodoncia hasta procedimientos más complejos, OdontoMed es el lugar ideal para cuidar tu sonrisa.
                                </Text>
                            </Box>
                            <Box display="flex" justifyContent="center">
                                <Image
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1hCWgVsuTBLS7J7WFgxR7bPUOd_VVV4rQkw&s"
                                    alt="OdontoMed Clinic"
                                    maxWidth="100%"
                                    height="auto"
                                    borderRadius="md"
                                />
                            </Box>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Modal Contacto */}
            <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Contacto</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Llámanos al: <strong>79575745</strong></Text>
                        <Text>Correo electrónico: <strong>odomed@gmail.com</strong></Text>
                        <Text>
                            Dirección: Av. Brasil, La Paz
                        </Text>
                        <Text>
                           Horarios de atención: Lunes a Sabado de 9:00 AM a 6:00 PM.
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default NavComponent;
