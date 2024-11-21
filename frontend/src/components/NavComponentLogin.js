import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, Avatar, MenuList, MenuItem, Modal, ModalContent, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, Box, Flex, Text, Button, Link, Image, IconButton, Collapse, VStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import usuarioService from '../services/usuarioService';
import EditUsuarioModal from './EditUsuarioModal';
import ConPermiso from './ConPermiso';
const NavComponentLogin = () => {
    const userRole = localStorage.getItem('role');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState(null);
    const [nombres, setNombres] = useState(null);
    const [apellidos, setApellidos] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [usuario, setUsuario] = useState(null); // Inicializa como null
    const [id, setId] = useState(null);  

    useEffect(() => {
        const storedId = localStorage.getItem('usuario_id');
        const storedEmail = localStorage.getItem('email');
        const storedNombres = localStorage.getItem('nombres');
        const storedApellidos = localStorage.getItem('apellidos');
        if (storedId) setId(storedId); 
        if (storedEmail) setEmail(storedEmail); 
        if (storedNombres) setNombres(storedNombres);
        if (storedApellidos) setApellidos(storedApellidos);
    }, []);

    const handleEdit = async () => {
        try {
            await loadUsuario();
            setIsEditModalOpen(true);
        } catch (error) {
            console.error("Error al cargar el usuario:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('permisos')
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('nombres');
        localStorage.removeItem('apellidos');
        localStorage.removeItem('usuario_id');
        navigate('/');
    }

    const loadUsuario = async () => {
        try {
            console.debug(id)
            const response = await usuarioService.getUsuario(id);
            setUsuario(response.data); // Asegura que el usuario tenga datos antes de abrir el modal
        } catch (error) {
            console.debug(id)

            console.error('Error fetching usuario:', error);
            setUsuario(null); // Establece usuario en null si ocurre un error
        }
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

                {/* Enlaces de navegación */}
                <Flex display={{ base: 'none', md: 'flex' }} alignItems="center" gap={6} flex="2" justifyContent="center">
                    <ConPermiso permiso='Ver Pacientes'>
                    <Link href="/usuarios" _hover={{ textDecoration: 'none', color: '#319795' }}><Text>Pacientes</Text></Link>
                    </ConPermiso>
                    <ConPermiso permiso='Ver Odontólogos'>
                    <Link href="/odontologos" _hover={{ textDecoration: 'none', color: '#319795' }}><Text>Odontologos</Text></Link>
                    </ConPermiso>
                    <ConPermiso permiso='Ver roles'>
                    <Link href="/roles" _hover={{ textDecoration: 'none', color: '#319795' }}><Text>Roles</Text></Link>
                    </ConPermiso>
                    <ConPermiso permiso='Ver Recepcionistas'>
                   <Link href="/recepcionistas" _hover={{ textDecoration: 'none', color: '#319795' }}><Text>Recepcionistas</Text></Link>
                   </ConPermiso>
                   <ConPermiso permiso='Ver citas'>
                   <Link href="/citas" _hover={{ textDecoration: 'none', color: '#319795' }}><Text>Citas</Text></Link>
                   </ConPermiso>
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

            {isEditModalOpen && usuario && (
                <EditUsuarioModal
                    usuario={usuario}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={(updatedUser) => {
                        setIsEditModalOpen(false);
                        loadUsuario();
                    }}
                />
            )}

            <Collapse in={isOpen} animateOpacity>
                <VStack spacing={4} alignItems="start" p={4} display={{ md: 'none' }} width="100%">
                    <Link href="/usuarios" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%"><Text textAlign="left">Usuarios</Text></Link>
                    <Link href="/roles" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%"><Text textAlign="left">Roles</Text></Link>
                    <Link href="/odontologos" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%"><Text textAlign="left">Odontologos</Text></Link>
                    <Link href="/recepcionistas" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%"><Text textAlign="left">Recepcionistas</Text></Link>
                    <Link href="/citas" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%"><Text textAlign="left">Citas</Text></Link>
                    <Button onClick={handleLogout} colorScheme="teal" width="100%">Cerrar sesión</Button>
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
                        <Button colorScheme="blue" variant='link' onClick={handleEdit}>EDITAR DATOS PERSONALES</Button>
                        <Button
                            variant="link"
                            onClick={() => navigate('/recuperar-contrasena')}
                            colorScheme="teal"
                        >
                            CAMBIAR CONTRASEÑA
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default NavComponentLogin;
