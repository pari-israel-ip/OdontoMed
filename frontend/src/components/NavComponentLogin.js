import React, { useState } from 'react';
import { Box, Flex, Text, Button, Link, Image, IconButton, Collapse, VStack } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';


const NavComponentLogin = () => {
    const userRole = localStorage.getItem('role');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        // Redirige al usuario a la página de inicio de sesión
        navigate('/login');
    }
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
                    {(userRole === 'ADMINISTRADOR' || userRole === 'ODONTOLOGO') && <Link href="/usuarios" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Pacientes</Text>
                    </Link>}
                    {(userRole === 'ADMINISTRADOR'||userRole==='RECEPCIONISTA') &&<Link href="/odontologos" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Odontologos</Text>
                    </Link>}
                    {userRole === 'ADMINISTRADOR' &&<Link href="/roles" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Roles</Text>
                    </Link>}
                    {(userRole === 'ADMINISTRADOR'|| userRole==='ODONTOLOGO') &&<Link href="/recepcionistas" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Recepcionistas</Text>
                    </Link>}
                   { (userRole==='RECEPCIONISTA'||userRole === 'ADMINISTRADOR'|| userRole==='ODONTOLOGO') &&<Link href="/citas" _hover={{ textDecoration: 'none', color: '#319795' }}>
                        <Text>Citas</Text>
                    </Link>}
                    
                    <Text></Text>
                    <Button onClick={handleLogout} colorScheme="teal">Cerrar sesión</Button>
                </Flex>
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
                    <Link href="/usuarios" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Usuarios</Text>
                    </Link>
                    <Link href="/roles" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Roles</Text>
                    </Link>
                    <Link href="/odontologos" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Odontologos</Text>
                    </Link>
                    <Link href="/recepcionistas" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Recepcionistas</Text>
                    </Link>
                    <Link href="/citas" _hover={{ textDecoration: 'none', color: '#319795' }} width="100%">
                        <Text textAlign="left">Citas</Text>
                    </Link>
            
                    <Text width="100%" textAlign="left"></Text>
                    <Button onClick={handleLogout} colorScheme="teal" width="100%">Cerrar sesión</Button>
                </VStack>
            </Collapse>
        </Box>
    );
};

export default NavComponentLogin;
