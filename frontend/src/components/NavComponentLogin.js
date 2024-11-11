import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Link, IconButton, Collapse, VStack, Menu, MenuButton, MenuList, MenuItem, Avatar, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const NavComponentLogin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState(null); // Estado para guardar el email
    const [nombres, setNombres] = useState(null); // Estado para los nombres
    const [apellidos, setApellidos] = useState(null); // Estado para los apellidos
    const navigate = useNavigate();

    // Cargar los datos del localStorage cuando el componente se monta
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        const storedNombres = localStorage.getItem('nombres');
        const storedApellidos = localStorage.getItem('apellidos');
        
        if (storedEmail) setEmail(storedEmail); 
        if (storedNombres) setNombres(storedNombres);
        if (storedApellidos) setApellidos(storedApellidos);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('nombres');
        localStorage.removeItem('apellidos');
        localStorage.removeItem('usuario_id');
        navigate('/login');
    };

    const handleAccountInfo = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                    <Link href="/usuarios" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Pacientes</Text>
                    </Link>
                    <Link href="/odontologos" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Odontologos</Text>
                    </Link>
                    <Link href="/roles" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Roles</Text>
                    </Link>
                    <Link href="/recepcionistas" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Recepcionistas</Text>
                    </Link>
                    <Link href="/citas" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Citas</Text>
                    </Link>
                </Flex>
           

                <Box flex="1" display="flex" justifyContent="flex-end">
                    <Menu>
                        <MenuButton as={IconButton} icon={<Avatar size="sm" src={" "} />} />
                        <MenuList>
                            <MenuItem onClick={handleAccountInfo}>Información de cuenta</MenuItem>
                            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <VStack spacing={4} alignItems="start" p={4} display={{ md: 'none' }} width="100%">
                    <Link href="/usuarios" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Usuarios</Text>
                    </Link>
                </VStack>
            </Collapse>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Información de la cuenta</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text><strong>Email:</strong> {email}</Text>
                        <Text><strong>Nombres:</strong> {nombres}</Text>
                        <Text><strong>Apellidos:</strong> {apellidos}</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default NavComponentLogin;
